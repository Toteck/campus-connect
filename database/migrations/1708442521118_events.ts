/* eslint-disable prettier/prettier */
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('slug').unique().notNullable()
      table.text('description').notNullable()
      table
        .enum('event_type', ['notícia', 'edital', 'evento', 'reunião', 'aviso'] as const)
        .notNullable()
      table
        .enum('public_type', ['student', 'professor', 'parent', 'general', ''] as const)
        .notNullable()
      table.string('thumbnail').nullable()
      table
        .integer('curso_id')
        .unsigned()
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('turma_id')
        .unsigned()
        .references('id')
        .inTable('classes')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
