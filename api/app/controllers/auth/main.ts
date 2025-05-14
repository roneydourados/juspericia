import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { validHash } from '../../services/hash.js'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  async store({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.query()
      .preload('profile', (query) => {
        query.preload('routes')
      })
      .where({ email, active: true })
      .first()

    if (!user) {
      return response.abort('Invalid credentials')
    }

    const isPasswordValid = await validHash(password, user.password)

    if (!isPasswordValid) {
      return response.abort('Invalid credentials')
    }

    // apagar tokens antigos
    await db.rawQuery(`delete from auth_access_tokens where tokenable_id = ${user.id}`)

    // Criando um token de acesso corretamente
    const token = await User.accessTokens.create(user)

    return {
      ...user.$attributes,
      ...user.$preloaded,
      token,
    }
  }
}
