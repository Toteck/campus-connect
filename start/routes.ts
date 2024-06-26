/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

// Session
Route.post('/sessions', 'SessionsController.store') // Login
// User
Route.post('/user', 'UsersController.store')

Route.group(() => {
  Route.put('user', 'UsersController.update')
  Route.get('user', 'UsersController.show')

  Route.get('modalidades', 'ModalidadesController.index')
  Route.get('modalidades/:id/cursos', 'ModalidadesController.cursosByModalidade')
  Route.get('cursos/:id/turmas', 'CoursesController.turmasByCurso')

  // Session
  Route.delete('/sessions', 'SessionsController.destroy')

  // Course
  Route.post('/course', 'CoursesController.store')
  Route.get('/course/:id', 'CoursesController.show')
  Route.get('/course', 'CoursesController.index')
  Route.get('/course/:id/classes', 'CoursesController.classesByCourse')
  Route.patch('/course/:id', 'CoursesController.update')
  Route.delete('/course/:id', 'CoursesController.destroy')

  // Classes
  Route.post('/classes', 'ClassesController.store')
  Route.patch('/classes/:id', 'ClassesController.update')
  Route.get('/classes/:id', 'ClassesController.show')
  Route.get('/classes', 'ClassesController.index')

  Route.get('categories', 'CategoriesController.index')
  Route.get('my-events', 'MyEventsController.index')

  Route.get('favorites', 'FavoritesController.index')
  Route.post('favorites', 'FavoritesController.store')
  Route.delete('/favorites/:id', 'FavoritesController.destroy')
}).middleware(['auth', 'acl:student,adm,parent,professor'])

Route.group(() => {
  // Events
  Route.post('/events', 'EventsController.store')
  Route.put('/events/:id', 'EventsController.update')
  Route.get('/events', 'EventsController.index')
  Route.get('/events/:id', 'EventsController.show')
  Route.delete('/events/:id', 'EventsController.destroy')
}).middleware(['auth', 'acl:adm'])
