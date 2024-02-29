import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Course from 'App/Models/Course'
import CreateCourseValidator from 'App/Validators/CreateCourseValidator'

export default class CoursesController {
  public async index({ request, response }) {
    const { ['name']: name, ['degree']: degree } = request.qs()

    console.log(name, degree)

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const coursesByQuery = this.filterByQueryString(degree, name)
    const courses = await coursesByQuery.paginate(page, limit)

    return response.ok({ courses })
  }

  public async show({ request, response }) {
    const id = request.param('id')

    const course = await Course.findOrFail(id)

    return response.ok({ course })
  }

  public async store({ response, request }: HttpContextContract) {
    // Validação dos dados passados na requisição
    const coursePayload = await request.validate(CreateCourseValidator)

    // Já esse existe um curso com esse nome?
    const courseByName = await Course.findBy('name', coursePayload.name)

    // Se sim então retorne 409
    if (courseByName) {
      throw new BadRequestException('There is already another course with that name', 409)
    }

    // Criação do curso
    const course = await Course.create(coursePayload)

    return response.created({ course })
  }

  private filterByQueryString(degree: string, name: string) {
    if (degree && name) return this.filterByNameAndDegree(degree, name)
    else if (degree) return this.filterByDegree(degree)
    else if (name) return this.filterByName(name)
    else return this.all()
  }

  private all() {
    return Course.query()
  }

  private filterByDegree(degree: string) {
    return Course.query().where('degree', degree)
  }

  private filterByName(name: string) {
    return Course.query().where('name', 'LIKE', `%${name}%`)
  }

  private filterByNameAndDegree(degree: string, name: string) {
    return Course.query().where('degree', degree).andWhere('name', 'LIKE', `%${name}%`)

    // if (degree) {
    //   query = query.where('degree', degree)
    // }

    // console.log(query)

    // if (name) {
    //   query = query.where((builder) => {
    //     builder.where('name', 'LIKE', `%${name}%`)
    //   })
    // }

    //return query
  }
}
