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
})
