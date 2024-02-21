import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Class from 'App/Models/Class'
import CreateClassValidator from 'App/Validators/CreateClassValidator'

export default class ClassesController {
  public async store({ request, response }: HttpContextContract) {
    const classPayload = await request.validate(CreateClassValidator)

    const classe = await Class.create(classPayload)
    await classe.load('courseClass')
    return response.created({ classe })
  }
}
