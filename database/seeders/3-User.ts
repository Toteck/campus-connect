import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'adm',
        email: 'adm@gmail.com',
        password: '12345678',
        profile: 'adm',
      },
      {
        name: 'Mateus Weslley',
        email: 'mateus@gmail.com',
        password: '12345678',
        profile: 'student',
      },
    ])
  }
}
