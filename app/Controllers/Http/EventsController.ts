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
}
