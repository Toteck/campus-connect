import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Class from 'App/Models/Class'
import User from 'App/Models/User'
import Event from 'App/Models/Event'
import Course from 'App/Models/Course'

export default class MyEventsController {
  public async index({ auth, request, response }: HttpContextContract) {
    // Pega o id do usuário autenticado por meio do auth
    const { id } = auth.user!.$attributes

    // Busca o modelo do usuário
    const user = await User.findByOrFail('id', id)

    // Busca o modelo de turma
    const turma = await Class.findOrFail(1)

    // Associa o usuário estudante a um curso e turma
    await user.related('classe').associate(turma)

    // Associa um evento a um curso e turma especificos
    // 1) Busca o curso
    const curso = await Course.findOrFail(1)
    curso.related('classes').firstOrCreate({}, turma)
    const evento = await Event.findOrFail(1)
    await evento.related('curso').associate(curso)
    await evento.related('turma').associate(turma)
    await evento.load('curso')
    await evento.load('turma')

    await Event.query()

    // Se o usuário for um estudante então pesquisamos a turma a que ele pertence

    let events
    if (user.profile === 'student') {
      const turmaStudent = await user.related('classe').query().firstOrFail()

      events = await Event.query()
        .where('publicType', user.profile)
        .andWhere('cursoId', turmaStudent.courseId)
        .andWhere('turmaId', turmaStudent.id)
    } else {
      events = await Event.query().where('publicType', user.profile)
    }

    const { profile, classId } = await auth.user!
    const classStudent = await Class.findOrFail(classId)
    const cursoId = classStudent.courseId

    const eventsQuery = this.filterMyEvents(profile, classId, cursoId)

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const eventos = await eventsQuery.paginate(page, limit)

    return response.ok({ eventos })
  }

  private filterMyEvents(profile: string, classId: number, cursoId: number) {
    let query

    if (profile && cursoId && classId) {
      query = Event.query()
        .where('publicType', profile)
        .orWhere('cursoId', cursoId)
        .orWhere('turmaId', classId)
    } else if (profile && cursoId) {
      query = Event.query().where('publicType', profile).orWhere('cursoId', cursoId)
    } else {
      query = Event.query().where('publicType', profile)
    }
    // if (cursoId || classId) {
    //   query = query
    //     .where('publicType', classId)
    //     .orWhere('cursoId', cursoId)
    //     .orWhere('turmaId', classId)
    // }
    // } else if (cursoId) {
    //   query = query.where('cursoId', cursoId)
    // }

    return query
  }
}
