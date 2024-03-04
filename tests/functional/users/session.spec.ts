/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AdmFactory from 'Database/factories/AdmFactory'

test.group('Session', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should authenticate an adm user', async ({ client, assert }) => {
    const purePassword = 'test123456'

    const { id, email } = await AdmFactory.merge({ password: purePassword }).create()

    const response = await client.post('/sessions').json({ email, password: purePassword })
    response.assertStatus(201)
    console.log({ user: response.body().user })
    console.log({ user: response.body().token })
    assert.isDefined(response.body().user, 'User undefined')
    assert.equal(response.body().user.id, id)
  })

  test('it should return 400 when credentials are invalid', async ({ client, assert }) => {
    const { id, email } = await AdmFactory.create()

    const response = await client.post('/sessions').json({ email, password: 'test' })
    response.assertStatus(400)
    console.log(response.body())
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 400)
    assert.equal(response.body().message, 'Credenciais inválidas')
  })
})
