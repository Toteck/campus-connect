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
      },
      {
        title: 'Reunião de Pais e Mestres - Junho 2023',
        description:
          'Convocação para a reunião de pais e mestres que será realizada no dia 15 de junho de 2023, às 19h, no auditório principal.',
        eventType: 'reunião',
        publicType: 'parent',
      },
      {
        title: 'Aviso Importante sobre a Biblioteca',
        description:
          'Informamos que a biblioteca estará fechada para manutenção nos dias 20 e 21 de junho de 2023.',
        eventType: 'aviso',
        publicType: 'general',
      },
      {
        title: 'Notícia: Nova Pesquisa Publicada',
        description:
          'O professor Dr. João Silva publicou uma nova pesquisa sobre Inteligência Artificial na revista Science.',
        eventType: 'notícia',
        publicType: 'professor',
      },
      {
        title: 'Evento Cultural - Festa Junina',
        description:
          'Participe da nossa tradicional Festa Junina, que será realizada no dia 24 de junho de 2023, com muitas brincadeiras e comidas típicas.',
        eventType: 'evento',
        publicType: 'general',
      },
      {
        title: 'EDITAL PRPGI Nº 34/2023 - PIBIC Ensino Médio',
        description:
          'Edital contendo as normas e procedimentos para as inscrições, seleção e classificação dos candidatos ao Programa de Bolsas de Iniciação Científica do Ensino Médio (PIBIC Ensino Médio), vigência 2023/2024.',
        eventType: 'edital',
        publicType: 'student',
      },
      {
        title: 'Aviso de Segurança - Atualização de Senhas',
        description:
          'Todos os usuários devem atualizar suas senhas de acesso ao sistema até o dia 30 de junho de 2023.',
        eventType: 'aviso',
        publicType: 'general',
      },
      {
        title: 'Reunião de Coordenação - Projeto ABC',
        description:
          'Reunião da equipe de coordenação do Projeto ABC para discutir as próximas etapas do projeto.',
        eventType: 'reunião',
        publicType: 'professor',
      },
      {
        title: 'Notícia: Aluno Ganha Prêmio Nacional',
        description:
          'O aluno Pedro Souza ganhou o primeiro lugar no Prêmio Nacional de Inovação Tecnológica com seu projeto de robótica.',
        eventType: 'notícia',
        publicType: 'student',
      },
      {
        title: 'Evento de Capacitação para Professores',
        description:
          'Capacitação sobre novas metodologias de ensino, a ser realizada no dia 10 de julho de 2023.',
        eventType: 'evento',
        publicType: 'professor',
      },
    ])
  }
}
