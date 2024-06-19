import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ response, request, auth }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)

    const user = await User.create(userPayload)

    const token = await auth.use('api').attempt(userPayload['email']!, userPayload.password, {
      expiresIn: '7days',
    })

    return response.created({ user, token })
  }
}
