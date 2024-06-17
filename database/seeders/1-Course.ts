import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'

export default class extends BaseSeeder {
  public async run() {
    await Course.createMany([
      {
        name: 'Sistemas para internet',
        degree: 'superior',
      },
    ])
  }
}
