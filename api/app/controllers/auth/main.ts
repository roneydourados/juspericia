import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Profile from '#models/profile'
import UserToken from '#models/user_token'
import Address from '#models/address'

import { validHash } from '../../services/hash.js'
import db from '@adonisjs/lucid/services/db'

import { createPostValidator } from '#validators/user/main'
import dayjs from 'dayjs'
import { uuidv7 } from 'uuidv7'
import { addressCategoryType } from '../../utils/datatypes.js'

export default class AuthController {
  async store({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    try {
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
    } catch (error) {
      console.log('Error in auth:', error)
      return response.abort('Error in auth', 500)
    }
  }

  async verifyUser({ params, response }: HttpContext) {
    const { id } = params

    const user = await User.query()
      .preload('profile', (query) => {
        query.preload('routes')
      })
      .where({ id })
      .first()

    if (!user) {
      return response.abort('Invalid user!')
    }

    // Criando um token de acesso corretamente
    const token = await User.accessTokens.create(user)

    return {
      ...user.$attributes,
      ...user.$preloaded,
      token,
    }
  }

  async register({ request, response }: HttpContext) {
    const data = request.all()
    try {
      const profile = await Profile.query().where({ type: 'ADVOGADO' }).first()

      if (!profile) {
        return response.abort('Profile not found')
      }

      //validar os dados
      const payload = await createPostValidator.validate(data)

      //verificar se já não existe um usuário com o mesmo email
      const userExists = await User.query().where({ email: payload.email }).first()

      if (userExists && userExists.active) {
        return response.abort('User already exists')
      }

      const expiresAt = dayjs().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')

      if (userExists && !userExists.active) {
        await UserToken.query().delete().where({ userId: userExists.id })

        //token temporário para ativação de conta
        await UserToken.create({
          userId: userExists.id,
          token: uuidv7(),
          expiresAt,
        })

        // aqui criar a rotina para enviar o email
      }

      const user = await User.create({
        ...payload,
        profileId: profile.id,
      })

      if (payload.Address) {
        await Address.create({
          addressCity: payload.Address.addressCity,
          addressComplement: payload.Address.addressComplement,
          addressDistrict: payload.Address.addressDistrict,
          addressNumber: payload.Address.addressNumber,
          addressState: payload.Address.addressState,
          addressStreet: payload.Address.addressStreet,
          addressZipcode: payload.Address.addressZipcode,
          ownerId: user.id,
          addressCategory: addressCategoryType.user,
        })
      }

      //token temporário para ativação de conta
      await UserToken.create({
        userId: user.id,
        token: uuidv7(),
        expiresAt,
      })

      /**Criar a rotina de envio de email
       *
       *
       */

      return user
    } catch (error) {
      console.log('Error in register:', error)
      return response.abort('Error in register', 500)
    }
  }

  async activeAccount({ params, response }: HttpContext) {
    const { token } = params

    try {
      const tokenExists = await UserToken.query().where({ token }).first()

      if (!tokenExists) {
        return response.abort('Token not found', 404)
      }

      const expired = dayjs().isAfter(dayjs(tokenExists?.expiresAt))

      if (expired) {
        return response.abort('Token expired', 400)
      }

      //localizar o usuário
      const user = await User.query().where({ id: tokenExists.userId }).first()

      //se não existir o usuário dar erro
      if (!user) {
        return response.abort('User not found', 404)
      }

      //se o usuário ativar o usuário
      user.merge({
        active: true,
      })

      //persistir os dados no banco
      await user.save()

      //apagar todos os tokens do usuário
      await UserToken.query().delete().where({ userId: user.id })
    } catch (error) {
      console.log('Error in activeAccount:', error)
      return response.abort('Error in activeAccount', 500)
    }
  }

  async forgotActivateLink({ params, response }: HttpContext) {
    const { token } = params

    try {
      const tokenExists = await UserToken.query().where({ token }).first()

      if (!tokenExists) {
        return response.abort('Token not found', 404)
      }

      const user = await User.query().where({ id: tokenExists.userId }).first()

      if (!user) {
        return response.abort('User not found', 404)
      }

      await UserToken.query().delete().where({ userId: user.id })

      const expiresAt = dayjs().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')

      //token temporário para ativação de conta
      await UserToken.create({
        userId: user.id,
        token: uuidv7(),
        expiresAt,
      })

      /**Criar a rotina de envio de email
       *
       *
       */

      return {
        name: user.name,
        email: user.email,
        active: user.active,
      }
    } catch (error) {
      console.log('Error in forgotActivateLink:', error)
      return response.abort('Error in forgotActivateLink', 500)
    }
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = request.only(['email'])

    try {
      const user = await User.query().where({ email }).first()
      if (!user) {
        return response.abort('User not found', 404)
      }

      const expiresAt = dayjs().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')

      //token temporário para ativação de conta
      await UserToken.create({
        userId: user.id,
        token: uuidv7(),
        expiresAt,
      })

      /**Criar a rotina de envio de email
       *
       *
       */
    } catch (error) {
      console.log('Error in forgotPassword:', error)
      return response.abort('Error in forgotPassword', 500)
    }
  }

  async renewPassword({ params, response }: HttpContext) {
    const { token, password } = params
    try {
      if (!password) {
        return response.abort('Password is required', 400)
      }

      if (!token) {
        return response.abort('Token is required', 400)
      }

      //verificar se o token existe
      const tokenExists = await UserToken.query().where({ token }).first()

      if (!tokenExists) {
        return response.abort('Token not found', 404)
      }

      //verificar se o token não está expirado
      const expired = dayjs().isAfter(dayjs(tokenExists.expiresAt))
      if (expired) {
        return response.abort('Token expired', 400)
      }

      //localizar o usuário
      const user = await User.query().where({ id: tokenExists.userId }).first()

      //se não existir o usuário dar erro
      if (!user) {
        return response.abort('User not found', 404)
      }

      //se o usuário ativar o usuário
      user.merge({
        password, // não precisa encriptar novamente, pois o model de usuário ja faz isso
      })

      //persistir os dados no banco
      await user.save()

      //apagar todos os tokens do usuário
      await UserToken.query().delete().where({ userId: user.id })

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    } catch (error) {
      console.log('Error in renewPassword:', error)
      return response.abort('Error in renewPassword', 500)
    }
  }
}
