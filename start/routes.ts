/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// User
Route.post('/users', 'UsersController.store')

// Course
Route.post('/course', 'CoursesController.store')
Route.get('/course/:id', 'CoursesController.show')
Route.get('/course', 'CoursesController.index')
Route.patch('/course/:id', 'CoursesController.update')
Route.delete('/course/:id', 'CoursesController.destroy')

// Classes
Route.post('/classes', 'ClassesController.store')
Route.get('/classes/:id', 'ClassesController.show')
Route.get('/classes', 'ClassesController.index')

// Events
Route.post('/events', 'EventsController.store')
Route.patch('/events/:id', 'EventsController.update')
Route.get('/events', 'EventsController.index')
Route.delete('/events/:id', 'EventsController.destroy')
