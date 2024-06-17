import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  ManyToMany,
  beforeSave,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Class from './Class'
import Event from './Event'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public profile: 'student' | 'parent' | 'adm' | 'professor'

  @column()
  public classId: number

  @belongsTo(() => Class)
  public classe: BelongsTo<typeof Class>

  @hasMany(() => Event)
  public events: HasMany<typeof Event>

  @manyToMany(() => Event, {
    pivotTable: 'user_favorites',
  })
  public favorites: ManyToMany<typeof Event>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }
}
