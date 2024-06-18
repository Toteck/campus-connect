import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FavoritesController {
  public async index({ request, response, auth }: HttpContextContract) {
    try {
      const favorites = await auth.user?.related('favorites').query()
      return response.json(favorites)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const { id } = request.body()
      let favoritesEvents = await auth.user!.related('favorites').query()

      const favoriteAlreadyExists = favoritesEvents.map((fav) => {
        if (fav.id === id) {
          return true
        }
      })
      console.log(favoriteAlreadyExists)
      if (favoriteAlreadyExists.length > 0) {
        return response.noContent()
      }
      await auth.user!.related('favorites').attach([id])

      await auth.user!.save()

      await auth.user!.refresh()

      return response.status(201)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  public async destroy({ request, response, auth }: HttpContextContract) {
    try {
      const id = request.param('id')
      console.log(id)
      await auth.user?.related('favorites').detach([id])
      await auth.user!.save()
      await auth.user!.refresh()

      return response.noContent()
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
