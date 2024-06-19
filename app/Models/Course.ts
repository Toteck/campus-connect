import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Class from './Class'
import Modalidade from './Modalidade'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Course extends BaseModel {
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

  @column()
  public modalidadeId: number

  @hasMany(() => Class)
  public classes: HasMany<typeof Class>

  @belongsTo(() => Modalidade, {
    foreignKey: 'modalidadeId',
  })
  public modalidade: BelongsTo<typeof Modalidade>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
