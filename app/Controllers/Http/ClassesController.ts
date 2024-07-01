import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Class from 'App/Models/Class'
import Course from 'App/Models/Course'
import CreateClassValidator from 'App/Validators/CreateClassValidator'
import UpdateClassValidator from 'App/Validators/UpdateClassValidator'
import slug from 'slug'

export default class ClassesController {
  public async index({ request, response }: HttpContextContract) {
    const { ['name']: name } = request.qs()

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const classByQuery = this.filterByQueryString(name)
    const classes = await classByQuery.paginate(page, limit)

    return response.ok({ classes })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const classe = await Class.findOrFail(id)
    await classe.load('course')
    return response.ok({ classe })
  }

  public async store({ request, response }: HttpContextContract) {
    const classPayload = await request.validate(CreateClassValidator)

    // Verificando se existe outra turma com os mesmos dados
    const existingClass = await Class.query().where('name', classPayload.name).first()

    if (existingClass) {
      throw new BadRequestException('Another class with the same data already exists', 409)
    }

    const classe = await Class.create(classPayload)
    return response.created({ classe })
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const classPayload = await request.validate(UpdateClassValidator)

    const classe = await Class.findOrFail(id)

    if (classPayload.courseId) {
      let courseUpdateId: number = classPayload.courseId
      // Verificar se o curso fornecido existe
      await Course.findOrFail(courseUpdateId)
    }

    // Verificar se a atualização resultará em uma duplicação de turma
    const existingClass = await Class.query()
      .where('name', classPayload.name ?? classe.name)
      .where('course_id', classPayload.courseId ?? classe.courseId)
      .whereNot('id', id)
      .first()

    if (existingClass) {
      throw new BadRequestException('There is already another class with this same data', 409)
    }

    const slugName = classPayload.name ? slug(classPayload.name) : classe.slug

    const updatedClass = await classe.merge({ ...classPayload, slug: slugName }).save()

    return response.ok({ classe: updatedClass })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const classe = await Class.findOrFail(id)
    await classe.delete()
    return response.ok({})
  }

  private filterByQueryString(name: string) {
    if (name) return this.filterByName(name)
    else return this.all()
  }

  private all() {
    return Class.query()
  }

  private filterByName(name: string) {
    return Class.query().where('name', 'LIKE', `%${name}%`)
  }
}
