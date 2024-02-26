/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import EventFactory from 'Database/factories/EventFactory'

test.group('Events', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an event', async ({ client }) => {
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description:
        'Processo Seletivo Simplificado para o Programa de Monitoria referente ao primeiro semestre de 2024 para os Cursos Superiores do IFMA Campus Timon.',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload)

    const { ...expected } = eventPayload

    console.log(response.body().event)
    response.assertStatus(201)
    response.assertBodyContains({ event: expected })
  })

  test('it should try to create an event with an already existing title', async ({
    client,
    assert,
  }) => {
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description:
        'Processo Seletivo Simplificado para o Programa de Monitoria referente ao primeiro semestre de 2024 para os Cursos Superiores do IFMA Campus Timon.',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload)
    response.assertStatus(201)

    // Tentando criar outro evento com o mesmo título
    const eventPayload2 = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description:
        'Processo Seletivo Simplificado para o Programa de Monitoria referente ao primeiro semestre de 2024 para os Cursos Superiores do IFMA Campus Timon.',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response2 = await client.post('/events').json(eventPayload2)

    response2.assertStatus(409)

    const body = response2.body()
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  // Implementação do teste para tentar atualizar um evento
  test('it should update an event', async ({ client, assert }) => {
    const event = await EventFactory.create()

    const eventPayload = {
      title: 'test',
      description: 'test',
      date: '2024-02-01',
      category: 'edital',
    }

    const response = await client.patch(`/events/${event.id}`).json(eventPayload)

    const body = response.body()

    response.assertStatus(200)
    assert.exists(body.event, 'Event undefined')
    assert.equal(body.event.title, eventPayload.title)
    assert.equal(body.event.description, eventPayload.description)
    assert.equal(body.event.date, eventPayload.date)
    assert.equal(body.event.category, eventPayload.category)
  })

  // Implementação do teste para tentar atualizar um evento com outro título já existente em outro evento.

  test('should try to update an event with an already existing title in another event', async ({
    client,
    assert,
  }) => {
    const event = await EventFactory.create()
    const event2 = await EventFactory.create()

    // Iremos tentar atualizar o evento 1 com o título do evento 2.
    // Deve ocorrer um erro informando que o título está sendo utilizado por outro evento!
    const eventPayload = {
      title: event2.title,
      description: 'test',
      date: '2024-02-01',
      category: 'edital',
    }

    const response = await client.patch(`/events/${event.id}`).json(eventPayload)

    const body = response.body()

    response.assertStatus(409)
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  // Retorna todos os eventos
  test('it should return all events', async ({ client, assert }) => {
    for (let i = 0; i < 6; i++) {
      await EventFactory.create()
    }

    const response = await client.get('/events')

    response.assertStatus(200)

    console.log(response.body())
  })

  test('it should return all events by title', async ({ client, assert }) => {
    // Criação de um evento
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description: 'teste',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload)
    response.assertStatus(201)

    // Criação de um evento
    const eventPayload2 = {
      title: 'Edital nº 10 - Processo Seletivo Qualquer coisa - IFMA TIMON',
      description: 'qualquer coisa',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response2 = await client.post('/events').json(eventPayload2)
    response2.assertStatus(201)

    // Busca do evento pelo título "Monitoria"
    const response3 = await client.get(`/events?text=Monitoria`)
    response3.assertStatus(200)

    console.log(response3.body())
  })

  test('it should return all events by description', async ({ client, assert }) => {
    // Criação de um evento
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description: 'teste',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload)
    response.assertStatus(201)

    // Criação de um evento
    const eventPayload2 = {
      title: 'Edital nº 10 - Processo Seletivo - IFMA TIMON',
      description: 'qualquer coisa',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response2 = await client.post('/events').json(eventPayload2)
    response2.assertStatus(201)

    // Busca do evento pelo título "Monitoria"
    const response3 = await client.get(`/events?text=qualquer coisa`)
    response3.assertStatus(200)

    console.log(response3.body())
  })

  test('it should return all events by category', async ({ client, assert }) => {
    for (let i = 0; i < 3; i++) {
      await EventFactory.merge({ category: 'notícia' }).create()
    }

    for (let i = 0; i < 3; i++) {
      await EventFactory.merge({ category: 'edital' }).create()
    }

    const response = await client.get(`/events?category=edital`)

    response.assertStatus(200)

    console.log(response.body())
  })
})
