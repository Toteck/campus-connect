/* eslint-disable prettier/prettier */
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Group', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a course', async ({ client }) => {
    const coursePayload = {
      degree: 'médio técnico',
      name: 'Informática',
    }

    const response = await client.post('/course').json(coursePayload)
    const { ...expected } = coursePayload
    response.assertStatus(201)
    response.assertBodyContains({ course: expected })
  })

  test('should return 422 when required course data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/course').json({})
    response.assertStatus(422)
    console.log(response.body())
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })
})
