/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Events', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an event', async ({ client, assert }) => {
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description:
        'Processo Seletivo Simplificado para o Programa de Monitoria referente ao primeiro semestre de 2024 para os Cursos Superiores do IFMA Campus Timon.',
      date: '21/02/2024',
      category: 'edital',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload)

    response.assertStatus(201)

    console.log(response.body().event)
  })
})
