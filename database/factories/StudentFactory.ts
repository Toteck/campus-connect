import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(User, ({ faker }) => {
  return {
    name: 'Mateus Weslley de Oliveira Freitas',
    email: faker.internet.email({ firstName: 'mateus', lastName: 'weslley' }),
    password: faker.internet.password({ length: 8 }),
    profile: 'student' as const,
    photo: faker.image.url(),
  }
}).build()
