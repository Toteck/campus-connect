import Route from '@ioc:Adonis/Core/Route'

// User
Route.post('/users', 'UsersController.store')

// Session
Route.post('/sessions', 'SessionsController.store')
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

// Events
Route.post('/events', 'EventsController.store')
Route.patch('/events/:id', 'EventsController.update')
Route.get('/events', 'EventsController.index')
Route.delete('/events/:id', 'EventsController.destroy')
