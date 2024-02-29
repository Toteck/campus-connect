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

  test('Try to create a course with a name already used by another course', async ({
    client,
    assert,
  }) => {
    const coursePayload = {
      degree: 'médio técnico',
      name: 'Informática',
    }

    const response = await client.post('/course').json(coursePayload)
    response.assertStatus(201)

    const response2 = await client.post('/course').json(coursePayload)
    response2.assertStatus(409)
    const body = response2.body()
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return a course', async ({ client, assert }) => {
    const coursePayload = {
      degree: 'médio técnico',
      name: 'Informática',
    }

    const response = await client.post('/course').json(coursePayload)
    response.assertStatus(201)

    const response2 = await client.get(`/course/${response.body().course.id}`)

    console.log(response2.body().course)
  })

  test('should try to return a course with an invalid id', async ({ client, assert }) => {
    const response = await client.get('/course/1')
    const body = response.body()
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 404)
  })

  test('it should return all courses', async ({ client, assert }) => {
    const informatica = {
      degree: 'médio técnico',
      name: 'Informática',
    }
    const edificacoes = {
      degree: 'médio técnico',
      name: 'edificações',
    }
    const administracao = {
      degree: 'médio técnico',
      name: 'administracão',
    }

    const response = await client.post('/course').json(informatica)
    response.assertStatus(201)
    const response2 = await client.post('/course').json(edificacoes)
    response2.assertStatus(201)
    const response3 = await client.post('/course').json(administracao)
    response3.assertStatus(201)

    const response4 = await client.get('/course')

    console.log(response4.body().data)
  })

  test('should return 422 when required course data is not provided', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/course').json({})
    response.assertStatus(422)

    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })
})
