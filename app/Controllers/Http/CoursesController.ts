import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Course from 'App/Models/Course'
import CreateCourseValidator from 'App/Validators/CreateCourseValidator'

export default class CoursesController {
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
}
