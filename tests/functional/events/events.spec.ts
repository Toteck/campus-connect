/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

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
})
