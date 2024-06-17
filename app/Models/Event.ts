/* eslint-disable prettier/prettier */
import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import User from './User'
import Course from './Course'
import Class from './Class'

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

  @column()
  public userId: number

  @column()
  public cursoId: number

  @column()
  public turmaId: number

  @belongsTo(() => User)
  public author: BelongsTo<typeof User>

  @belongsTo(() => Course, {
    foreignKey: 'cursoId',
  })
  public curso: BelongsTo<typeof Course>

  @belongsTo(() => Class, {
    foreignKey: 'turmaId',
  })
  public turma: BelongsTo<typeof Class>

  @manyToMany(() => User, {
    pivotTable: 'user_favorites',
  })
  public usersLiked: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
