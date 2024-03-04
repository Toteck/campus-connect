/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AdmFactory from 'Database/factories/AdmFactory'

test.group('Session', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should authenticate an user', async ({ client, assert }) => {
    const purePassword = 'test123456'

    const { id, email } = await AdmFactory.merge({ password: purePassword }).create()

    const response = await client.post('/sessions').json({ email, password: purePassword })
    response.assertStatus(201)
    console.log({ user: response.body().user })
    console.log({ user: response.body().token })
    assert.isDefined(response.body().user, 'User undefined')
    assert.equal(response.body().user.id, id)
  })
})
