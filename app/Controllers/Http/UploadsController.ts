import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import uploadConfig from 'Config/upload'

export default class UploadsController {
  public async show({ params, response }: HttpContextContract) {
    /**
     * Retorna o download de um arquvo local usando
     * o caminho temporário "tmpPath" e o diretório
     * configurado em "uploadConfig.config.disk.folder"
     */
    return response.download(Application.tmpPath(uploadConfig.config.disk.folder, params.file))
  }
}
