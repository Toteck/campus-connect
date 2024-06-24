import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import Modalidade from 'App/Models/Modalidade'

export default class ModalidadesController {
  public async index({ response }: HttpContextContract) {
    const modalidades = await Modalidade.query()

    return response.ok({ modalidades })
  }

  public async cursosByModalidade({ params, response }: HttpContextContract) {
    const modalidadeId = params.id
    const cursos = await Course.query().where('modalidadeId', modalidadeId)

    return response.ok({ cursos })
  }
}
