/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Classes', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a class', async ({ client, assert }) => {
    // Para mim criar uma turma eu preciso criar um curso antes
    const coursePayload = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(coursePayload)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma
    const classPayload = {
      name: 'Tec. em Sistemas de Internet 2022.2',
      year: '2022',
      period: '2',
      shift: 'vespertino',
      courseId: course.id,
    }

    const response2 = await client.post('/classes').json(classPayload)

    response2.assertStatus(201)
    console.log(response2.body().classe)
  })

  test('it should try to create a class with data being used by another class', async ({
    client,
    assert,
  }) => {
    // Para mim criar uma turma eu preciso criar um curso antes
    const coursePayload = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(coursePayload)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma
    const classPayload = {
      name: 'Tec. em Sistemas de Internet 2022.2',
      year: '2022',
      period: '2',
      shift: 'vespertino',
      courseId: course.id,
    }

    const response2 = await client.post('/classes').json(classPayload)
    response2.assertStatus(201)
    const response3 = await client.post('/classes').json(classPayload)

    console.log(response3.body())
  })

  test('it should return a class', async ({ client, assert }) => {
    // Para mim criar uma turma eu preciso criar um curso antes
    const coursePayload = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(coursePayload)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma
    const classPayload = {
      name: 'Tec. em Sistemas de Internet 2022.2',
      year: '2022',
      period: '2',
      shift: 'vespertino',
      courseId: course.id,
    }

    const response2 = await client.post('/classes').json(classPayload)

    response2.assertStatus(201)

    const response3 = await client.get(`/classes/${response2.body().classe.id}`)

    console.log(response3.body().classe)
  })

  test('it should return a class with invalid id', async ({ client, assert }) => {
    const response = await client.get(`/classes/1`)

    assert.exists(response.body().message)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 404)
  })

  // Retorne todos as turmas
  test('it should return all class', async ({ client, assert }) => {
    // Para mim criar uma turma eu preciso criar um curso antes
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const biologia = {
      degree: 'superior',
      name: 'Biologia',
    }

    const response = await client.post('/course').json(sistemasParaInternet)
    response.assertStatus(201)
    const course = response.body().course

    const response2 = await client.post('/course').json(biologia)
    response.assertStatus(201)
    const course2 = response2.body().course

    // Criação da turma de Sistemas para Internet
    const classPayload = {
      name: 'Tec. em Sistemas de Internet',
      year: '2022',
      period: '2',
      shift: 'Verspertino',
      courseId: course.id,
    }

    // Criação da turma de Biologia
    const classPayload2 = {
      name: 'Licenciatura em Biologia',
      year: '2024',
      period: '1',
      shift: 'Integral',
      courseId: course2.id,
    }

    const response3 = await client.post('/classes').json(classPayload)
    response3.assertStatus(201)

    const response4 = await client.post('/classes').json(classPayload2)

    response4.assertStatus(201)

    const response5 = await client.get('/classes')

    console.log(response5.body().classes.data)
  })

  test('it should return all class by name', async ({ client, assert }) => {
    // Para mim criar uma turma eu preciso criar um curso antes
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const biologia = {
      degree: 'superior',
      name: 'Biologia',
    }

    const response = await client.post('/course').json(sistemasParaInternet)
    response.assertStatus(201)
    const course = response.body().course

    const response2 = await client.post('/course').json(biologia)
    response.assertStatus(201)
    const course2 = response2.body().course

    // Criação da turma de Sistemas para Internet
    const classPayload = {
      name: 'Tecnólogo em Sistemas de Internet',
      year: '2022',
      period: '2',
      shift: 'Verspertino',
      courseId: course.id,
    }

    // Criação da turma de Biologia
    const classPayload2 = {
      name: 'Licenciatura em Biologia',
      year: '2024',
      period: '1',
      shift: 'Integral',
      courseId: course2.id,
    }

    const response3 = await client.post('/classes').json(classPayload)
    response3.assertStatus(201)

    const response4 = await client.post('/classes').json(classPayload2)

    response4.assertStatus(201)

    const response5 = await client.get('/classes?name=Internet')

    console.log(response5.body().classes.data)
  })
})
