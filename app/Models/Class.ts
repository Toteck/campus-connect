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

export default class Class extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public year: string

  @column()
  public period: string

  @column()
  public shift: string

  @column({ columnName: 'course_id' })
  public courseId: number

  @belongsTo(() => Course, {
    foreignKey: 'courseId',
  })
  public courseClass: BelongsTo<typeof Course>

  @manyToMany(() => User, {
    pivotTable: 'users_classes',
  })
  public students: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
