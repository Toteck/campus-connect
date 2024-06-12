import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ response, request, auth }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)

    const user = await User.create(userPayload)

    // Fazendo o login do usuário criado
    /**
     * Problema: Usuário está sendo criado mas está ocorrendo um erro ao realizar o login porque a senha provavelmente está
     */

    const token = await auth.use('api').attempt(userPayload['email']!, userPayload.password, {
      expiresIn: '7days',
    })

    return response.created({ user, token })
  }
}
