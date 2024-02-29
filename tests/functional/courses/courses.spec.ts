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

    console.log(response4.body().courses.data)
  })

  // Retorna todos os cursos por nome
  test('it should return all courses by name', async ({ client, assert }) => {
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

    const response4 = await client.get('/course?name=ica')
    response4.assertStatus(200)

    console.log(response4.body().courses.data)
  })

  test('it should return all courses by degree', async ({ client, assert }) => {
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }
    const biologia = {
      degree: 'superior',
      name: 'Biologia',
    }
    const administracao = {
      degree: 'médio técnico',
      name: 'administracão',
    }

    const response = await client.post('/course').json(sistemasParaInternet)
    response.assertStatus(201)
    const response2 = await client.post('/course').json(biologia)
    response2.assertStatus(201)
    const response3 = await client.post('/course').json(administracao)
    response3.assertStatus(201)

    const response4 = await client.get('/course?degree=médio técnico')
    response4.assertStatus(200)

    console.log(response4.body().courses.data)
  })

  test('it should return all courses by name and degree', async ({ client, assert }) => {
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }
    const biologia = {
      degree: 'superior',
      name: 'Biologia',
    }

    const administracao = {
      degree: 'médio técnico',
      name: 'administracão',
    }

    const edificacoes = {
      degree: 'médio técnico',
      name: 'edificacões',
    }

    const response = await client.post('/course').json(sistemasParaInternet)
    response.assertStatus(201)
    const response2 = await client.post('/course').json(biologia)
    response2.assertStatus(201)
    const response3 = await client.post('/course').json(administracao)
    response3.assertStatus(201)
    const response4 = await client.post('/course').json(edificacoes)
    response4.assertStatus(201)

    const response5 = await client.get('/course?name=Internet&degree=superior')
    response5.assertStatus(200)

    console.log(response5.body().courses.data)
  })

  test('it should update a course', async ({ client, assert }) => {
    const biologia = {
      degree: 'médio técnico',
      name: 'Biologia',
    }

    const response = await client.post('/course').json(biologia)
    response.assertStatus(201)

    console.log(response.body().course)

    const updatedBiologia = {
      degree: 'superior',
      name: 'Biologia',
    }
    const response2 = await client
      .patch(`/course/${response.body().course.id}`)
      .json(updatedBiologia)

    response2.assertStatus(200)

    console.log(response2.body().course)
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
