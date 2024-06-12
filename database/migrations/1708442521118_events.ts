import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable().unique()
      table.text('description').notNullable()
      table
        .enum('event_type', ['notícia', 'edital', 'evento', 'reunião', 'aviso'] as const)
        .notNullable()
      table
        .enum('public_type', ['student', 'professor', 'parent', 'general', ''] as const)
        .notNullable()
      table.string('thumbnail').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
