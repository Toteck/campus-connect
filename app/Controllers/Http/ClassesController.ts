import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Class from 'App/Models/Class'
import CreateClassValidator from 'App/Validators/CreateClassValidator'

export default class ClassesController {
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
}
