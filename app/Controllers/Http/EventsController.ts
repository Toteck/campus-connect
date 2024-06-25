/* eslint-disable prettier/prettier */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateEventValidator from 'App/Validators/CreateEventValidator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Event from 'App/Models/Event'
import BadRequestException from 'App/Exceptions/BadRequestException'
import slug from 'slug'
import Database from '@ioc:Adonis/Lucid/Database'
import sharp from 'sharp'
import { ISaveFileDTO } from 'Contracts/interfaces/IStorageProvider'
import StorageProvider from '@ioc:CampusConnect/StorageProvider'

export default class EventsController {
  public async store({ response, request, auth }: HttpContextContract) {
    try {
      const response = await Database.transaction(async (trx) => {
        const { title, description, eventType, publicType, file } =
          await request.validate(CreateEventValidator)

        // Busco no banco de dados se já existe um evento com esse título
        const eventByTitle = await Event.findBy('title', title)

        if (eventByTitle) {
          throw new BadRequestException('Title is already being used by another event', 409)
        }

        const user = await auth.authenticate()
        const userId = user.id

        const event = new Event()
        event.useTransaction(trx)

        event.merge({ title, description, eventType, publicType, userId })
        await event.save()

        /**
         * Atualiza ou cria uma nova capa com um nome
         * gerado aleatoriamente
         */

        const thumbnail = await event.related('thumbnail').updateOrCreate(
          {},
          {
            fileCategory: 'thumbnail',
            fileName: `${cuid()}.${file?.extname}`,
          }
        )

        // Redimensiona a imagem usando biblioteca sharp
        const fileBuffer = await sharp(file?.tmpPath)
          .resize(1080, 1080, {
            fit: 'cover',
            position: 'center',
          })
          .toBuffer()

        const fileSave: ISaveFileDTO = {
          fileBuffer,
          fileName: thumbnail.fileName,
          fileType: file?.type,
          fileSubType: file?.subtype,
          isPublic: true,
        }

        // Salva o arquivo usando o StorageProvider
        await StorageProvider.saveFile(fileSave)

        return thumbnail
      })
      return response.serialize({
        fields: { pick: ['url'] },
      })
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }

    // Busco no banco de dados se já existe um evento com esse título
    // const eventByTitle = await Event.findBy('title', eventPayload.title)

    // if (eventByTitle) {
    //   throw new BadRequestException('Title is already being used by another event', 409)
    // }

    // const event = await Event.create(eventPayload)

    // return response.created({ event })
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
    const { qs, ['eventType']: eventType, ['publicType']: publicType } = request.qs()
    let text
    if (qs) {
      text = slug(qs)
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const eventsQuery = this.filterByQueryString(eventType, publicType, text) // Quando pegamos esse resultado sem o await está sendo retornado uma query de busca
    const events = await eventsQuery.paginate(page, limit)

    return response.ok({ events })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const event = await Event.findOrFail(id)
    return response.ok({ event })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const group = await Event.findOrFail(id)

    await group.delete()

    return response.ok({})
  }

  private filterByQueryString(eventType: string, publicType: string, text: string) {
    if (eventType && publicType && text)
      return this.filterByCategoriesTypeAndText(eventType, publicType, text)
    else if (eventType && publicType) return this.filterByCategories(eventType, publicType)
    else if (eventType) return this.filterByEventType(eventType)
    else if (publicType) return this.filterByPublicType(publicType)
    else if (text) return this.filterByText(text)
    else return this.all()
  }

  private all() {
    return Event.query()
  }

  private filterByEventType(eventType: string) {
    return Event.query().where('eventType', eventType)
  }

  private filterByPublicType(publicType: string) {
    return Event.query().where('publicType', publicType)
  }

  private filterByCategories(eventType: string, publicType: string) {
    return Event.query().where('eventType', eventType).andWhere('publicType', publicType)
  }

  private filterByText(text: string) {
    return Event.query().where('slug', 'LIKE', `%${text}%`)
  }

  /**
   *
   * Essa função tem um problema porque ela só retorna se o nome for exatamente igual ao que está salvo no bd
   */
  private filterByCategoriesTypeAndText(eventType: string, publicType: string, text: string) {
    let query = Event.query()

    if (publicType && eventType) {
      query = query.where('eventType', eventType).andWhere('publicType', publicType)
    }

    if (text) {
      query = query.where((builder) => {
        builder.where('slug', 'LIKE', `%${text}%`)
      })
    }

    return query
  }
}
