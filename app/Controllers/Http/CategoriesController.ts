import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
export default class CategoriesController {
  public async index({ response }: HttpContextContract) {
    // Step 1: Query the events and order by updatedAt

    const events = await Event.query().orderBy('updatedAt', 'desc')

    // Step 2: Group events by publicType
    const groupedEvents = events.reduce((acc, event) => {
      if (!acc[event.publicType]) {
        acc[event.publicType] = []
      }
      if (acc[event.publicType].length < 8) {
        acc[event.publicType].push(event)
      }
      return acc
    }, {})

    // Step 3: Convert the grouped events object to an array format if needed
    const data = Object.keys(groupedEvents).map((publicType) => ({
      publicType,
      events: groupedEvents[publicType],
    }))

    return response.ok({ data })
  }
}
