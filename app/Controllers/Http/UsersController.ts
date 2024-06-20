import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Class from 'App/Models/Class'

import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async store({ response, request, auth }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)

    const user = await User.create(userPayload)

    const token = await auth.use('api').attempt(userPayload['email']!, userPayload.password, {
      expiresIn: '7days',
    })

    return response.created({ user, token })
  }

  public async update({ response, request, auth }: HttpContextContract) {
    try {
      const userId = auth.user!.id // Assumindo que o usuário está autenticado
      const userNewData = await request.validate(UpdateUser)

      // Validar se o curso pertence à modalidade
      const turma = await Class.query()
        .where('id', userNewData.turma)
        .andWhere('courseId', userNewData.curso)
        .firstOrFail()

      const user = await User.findOrFail(userId)
      user.classId = turma.id

      // Atualizar outros campos se necessário
      if (userNewData.name) user.name = userNewData.name
      // Continue atualizando outros campos conforme necessário...

      await user.save()

      return response.ok({ user })
    } catch (error) {
      if (error instanceof BadRequestException) {
        return response.badRequest(error.message)
      }

      return response.status(400).json({ error: error.message })
    }
  }

  public async show({ response, auth }: HttpContextContract) {
    const user = await auth.user
    //const classe = await user?.load('classe')

    await user?.load((loader) => {
      loader.load('classe', (classeLoader) => {
        classeLoader.preload('course', (courseLoader) => {
          courseLoader.preload('modalidade')
        })
      })
    })

    return response.ok({ user })
  }
}
