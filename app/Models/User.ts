import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Class, {
    pivotTable: 'users_classes',
  })
  public classes: ManyToMany<typeof Class>

  @manyToMany(() => Event, {
    pivotTable: 'author_posts',
  })
  public events: ManyToMany<typeof Event>

  @manyToMany(() => Event, {
    pivotTable: 'user_favorites',
  })
  public favorites: ManyToMany<typeof Event>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }
}
