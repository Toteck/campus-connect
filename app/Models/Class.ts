import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Course from './Course'
import User from './User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Class extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name'],
  })
  public slug: string

  @column({ columnName: 'course_id' })
  public courseId: number

  @belongsTo(() => Course, {
    foreignKey: 'courseId',
  })
  public course: BelongsTo<typeof Course>

  @manyToMany(() => User, {
    pivotTable: 'users_classes',
  })
  public students: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
