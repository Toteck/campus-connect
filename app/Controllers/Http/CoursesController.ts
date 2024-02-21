import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import CreateCourseValidator from 'App/Validators/CreateCourseValidator'

export default class CoursesController {
  public async store({ response, request }: HttpContextContract) {
    // Validação dos dados passados na requisição
    const coursePayload = await request.validate(CreateCourseValidator)
    const course = await Course.create(coursePayload)
    return response.created({ course })
  }
}
