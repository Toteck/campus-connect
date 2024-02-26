import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateEventValidator from 'App/Validators/CreateEventValidator'
import Event from 'App/Models/Event'
import { DateTime } from 'luxon'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class EventsController {
  public async store({ response, request }: HttpContextContract) {
    const eventPayload = await request.validate(CreateEventValidator)

    // Busco no banco de dados se já existe um evento com esse título
    const eventByTitle = await Event.findBy('title', eventPayload.title)

    if (eventByTitle) {
      throw new BadRequestException('title is already being used by another event', 409)
    }

    const event = await Event.create(eventPayload)

    // Formatando a data para o formato desejado
    const formattedDate = DateTime.fromISO(event.date.toString()).toFormat('yyyy-MM-dd')

    // Criar um objeto contendo apenas as informações desejadas
    const responseData2 = {
      title: event.title,
      description: event.description,
      date: formattedDate,
      category: event.category,
      thumbnail: event.thumbnail,
      anexo: event.anexo,
    }

    return response.created({ event: responseData2 })
  }

  public async update({ request, response }: HttpContextContract) {
    // ID para encontrar o evento
    const id = request.param('id')

    // Informações para atualizar o evento
    const payload = request.all()

    // Encontramos o evento pelo ID
    const event = await Event.findOrFail(id)

    // Verifica se há outro evento com o mesmo título
    const existingEvent = await Event.query()
      .where('title', payload.title)
      .whereNot('id', id)
      .first()

    if (existingEvent) {
      throw new BadRequestException('Title is already being used by another event', 409)
    }

    // Realiza a atualização do evento
    const updatedEvent = await event.merge(payload).save()

    return response.ok({ event: updatedEvent })
  }

  public async index({ request, response }: HttpContextContract) {
    const { text, ['category']: category } = request.qs()

    //const events = this.all()
    const events = await this.filterByCategory(category)

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    return response.ok({ events })
  }

  private all() {
    return Event.query()
  }

  private filterByCategory(category: string) {
    return Event.query().where('category', category)
  }
}
