import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Event from 'App/Models/Event'

export default class extends BaseSeeder {
  public async run() {
    await Event.createMany([
      {
        title: 'EDITAL PRPGI Nº 33/2023 - PIBITI ENSINO SUPERIOR',
        description:
          'Edital contendo as normas e procedimentos para as inscrições, seleção e classificação dos candidatos ao Programa de Bolsas de Iniciação em Desenvolvimento Tecnológico e Inovação do Ensino Superior (PIBITI Ensino Superior), vigência 2023/2024.',
        eventType: 'edital',
        publicType: 'student',
        userId: 1,
      },
    ])
  }
}
