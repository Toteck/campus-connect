import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Class from 'App/Models/Class'
import CreateClassValidator from 'App/Validators/CreateClassValidator'

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
    await classe.load('courseClass')
    return response.ok({ classe })
  }

  public async store({ request, response }: HttpContextContract) {
    const classPayload = await request.validate(CreateClassValidator)

    // Verificando se existe outra turma com os mesmos dados
    const existingClass = await Class.query()
      .where('name', classPayload.name)
      .where('year', classPayload.year)
      .where('period', classPayload.period)
      .where('shift', classPayload.shift)
      .where('course_id', classPayload.courseId)
      .first()

    if (existingClass) {
      throw new BadRequestException('Another class with the same data already exists', 409)
    }

    const classe = await Class.create(classPayload)
    await classe.load('courseClass')
    return response.created({ classe })
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
