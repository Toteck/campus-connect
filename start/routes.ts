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
  Route.get('/courses/:id', 'CoursesController.show')
  Route.get('/courses', 'CoursesController.index')
  //Route.get('/course/:id/classes', 'CoursesController.classesByCourse')

  // Classes

  Route.get('/classes/:id', 'ClassesController.show')
  Route.get('/classes', 'ClassesController.index')

  Route.get('categories', 'CategoriesController.index')
  Route.get('my-events', 'MyEventsController.index')

  Route.get('favorites', 'FavoritesController.index')
  Route.post('favorites', 'FavoritesController.store')
  Route.delete('/favorites/:id', 'FavoritesController.destroy')
}).middleware(['auth', 'acl:student,adm,parent,professor'])

Route.group(() => {
  // Modalidades
  Route.post('modalidades', 'ModalidadesController.store')
  Route.put('modalidades/:id', 'ModalidadesController.update')
  Route.delete('modalidades/:id', 'ModalidadesController.destroy')
  // Course
  Route.post('/courses', 'CoursesController.store')
  Route.put('/courses/:id', 'CoursesController.update')
  Route.delete('/courses/:id', 'CoursesController.destroy')

  // Classe
  Route.post('/classes', 'ClassesController.store')
  Route.put('/classes/:id', 'ClassesController.update')
  Route.delete('classes/:id', 'ClassesController.destroy')

  // Events
  Route.post('/events', 'EventsController.store')
  Route.put('/events/:id', 'EventsController.update')
  Route.get('/events', 'EventsController.index')
  Route.get('/events/:id', 'EventsController.show')
  Route.delete('/events/:id', 'EventsController.destroy')
}).middleware(['auth', 'acl:adm'])
