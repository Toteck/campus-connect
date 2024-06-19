import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    modalidade: schema.number([rules.exists({ table: 'modalidades', column: 'id' })]),
    curso: schema.number([rules.exists({ table: 'courses', column: 'id' })]),
    turma: schema.number([rules.exists({ table: 'classes', column: 'id' })]),
    name: schema.string.optional({ trim: true }),
    // outros campos que você deseja validar
  })

  public messages: CustomMessages = {
    'modalidade.exists': 'Modalidade não encontrada',
    'curso.exists': 'Curso não encontrado',
    'turma.exists': 'Turma não encontrada',
  }
}
