import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Class from 'App/Models/Class'

export default class extends BaseSeeder {
  public async run() {
    await Class.createMany([
      {
        name: '2022.2',
        courseId: 4,
      },
      {
        name: '2023.1',
        courseId: 4,
      },
    ])
  }
}
