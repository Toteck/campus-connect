import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    eventType: schema.enum(['notícia', 'edital', 'evento', 'reunião', 'aviso'] as const),
    publicType: schema.enum(['student', 'professor', 'parent', 'general'] as const),
    file: schema.file.optional({
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })

  public messages: CustomMessages = {
    'title.required': 'O título é obrigatório',
    'description.required': 'A descrição é obrigatório',
    'date.required': 'A data é obrigatória',
    'category.required': 'A categoria é obrigatória',
  }
}
