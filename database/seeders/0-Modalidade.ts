import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Modalidade from 'App/Models/Modalidade'

export default class extends BaseSeeder {
  public async run() {
    await Modalidade.createMany([
      {
        name: 'Técnico Integrado',
      },
      {
        name: 'PROEJA',
      },
      {
        name: 'Técnico Subsequente',
      },
      {
        name: 'Ensino Superior',
      },
      {
        name: 'Pós-Graduação',
      },
    ])
  }
}
