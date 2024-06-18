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
      let favorites = await auth.user!.related('favorites').query()
      console.log(favorites)
      const favoriteAlreadyExists = favorites?.includes(id)
      if (favoriteAlreadyExists) {
        return response.ok({})
      }
      await auth.user!.related('favorites').attach([id])

      await auth.user!.save()

      await auth.user?.refresh()

      return response.status(201)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
