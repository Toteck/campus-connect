import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import Modalidade from 'App/Models/Modalidade'
import { schema } from '@ioc:Adonis/Core/Validator'
import slug from 'slug'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class ModalidadesController {
  public async index({ response }: HttpContextContract) {
    const modalidades = await Modalidade.query()

    return response.ok({ modalidades })
  }

  public async store({ request, response }: HttpContextContract) {
    const newModalidadeSchema = schema.create({
      name: schema.string({ trim: true }),
    })
    const modalidadePayload = await request.validate({ schema: newModalidadeSchema })

    const slugNameModalidade = slug(modalidadePayload.name)

    const existingModalidade = await Modalidade.query().where('slug', slugNameModalidade).first()

    if (existingModalidade) {
      throw new BadRequestException('Name is already being used by another course', 409)
    }

    const modalidade = await Modalidade.create(modalidadePayload)

    return response.created({ modalidade })
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const updateModalidadeSchema = schema.create({
      name: schema.string({ trim: true }),
    })
    const modalidadePayload = await request.validate({ schema: updateModalidadeSchema })

    const slugNameModalidade = slug(modalidadePayload.name)
    const existingModalidade = await Modalidade.query().where('slug', slugNameModalidade).first()

    if (existingModalidade) {
      throw new BadRequestException('Name is already being used by another course', 409)
    }

    const updateModalidade = await Modalidade.findOrFail(id)

    const updatedModalidade = await updateModalidade
      .merge({
        ...modalidadePayload,
        slug: slugNameModalidade,
      })
      .save()

    return response.ok({ modalidade: updatedModalidade })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const modalidade = await Modalidade.findOrFail(id)
    await modalidade.delete()
    return response.ok({})
  }

  public async cursosByModalidade({ params, response }: HttpContextContract) {
    const modalidadeId = params.id
    const cursos = await Course.query().where('modalidadeId', modalidadeId)

    return response.ok({ cursos })
  }
}
