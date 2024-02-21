import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Class extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public year: number

  @column()
  public period: number

  @column()
  public shift: string

  // @hasMany(() => LinkToken, {
  //   foreignKey: 'userId',
  // })
  // public tokens: HasMany<typeof LinkToken>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
