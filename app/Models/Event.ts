/* eslint-disable prettier/prettier */
import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import User from './User'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
  })
  public slug: string

  @column()
  public description: string

  @column()
  public eventType: 'notícia' | 'edital' | 'aviso' | 'reunião' | 'evento'

  @column()
  public publicType: 'student' | 'professor' | 'parent' | 'general'

  @column()
  public thumbnail: string | null

  @manyToMany(() => User, {
    pivotTable: 'author_posts',
  })
  public author: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'user_favorites',
  })
  public usersLiked: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
