import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { FileCategory } from 'App/Utils/fileCategory'
import uploadConfig from 'Config/upload'
import StorageProvider from '@ioc:CampusConnect/StorageProvider'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public fileCategory: FileCategory

  @column({ serializeAs: null })
  public fileName: string

  @column({ serializeAs: null })
  public isPublic: boolean

  @column({ serializeAs: null })
  public ownerId: number

  @computed()
  public get url(): string | null {
    if (!this.fileName) {
      return null
    }

    if (uploadConfig.driver === 'disk') {
      return `${uploadConfig.config.disk.url}/${uploadConfig.config.disk.folder}/${this.fileName}`
    }

    if (this.isPublic) {
      return `https://${uploadConfig.config.aws.bucket}.s3-${uploadConfig.config.aws.region}.amazonaws.com/${this.fileName}`
    }

    return StorageProvider.getFileSignature(this.fileName)
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
