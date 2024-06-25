/* eslint-disable prettier/prettier */
import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    files: schema.array().members(
      schema.file({
        size: '10mb',
        extnames: ['pdf'],
      })
    ),
    name: schema.string({ trim: true }),
  })
  public messages = {}
}
