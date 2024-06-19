import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'

export default class extends BaseSeeder {
  public async run() {
    await Course.createMany([
      {
        name: 'Administração',
        modalidadeId: 1,
      },
      {
        name: 'Administração',
        modalidadeId: 2,
      },
      {
        name: 'Análises Químicas',
        modalidadeId: 3,
      },
      {
        name: 'Sistemas para internet',
        modalidadeId: 4,
      },
      {
        name: 'Especialização em Ensino de Ciências ',
        modalidadeId: 5,
      },
    ])
  }
}
