import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateEventValidator from 'App/Validators/CreateEventValidator'
import Event from 'App/Models/Event'

export default class EventsController {
  public async store({ response, request }: HttpContextContract) {
    const eventPayload = await request.validate(CreateEventValidator)

    const event = await Event.create(eventPayload)

    return response.created({ event })
  }
}
