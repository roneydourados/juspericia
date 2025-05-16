import { User, Profile, UserToken, Address } from '#models/index'

import { validHash } from './hash.js'
import db from '@adonisjs/lucid/services/db'

import dayjs from 'dayjs'
import { uuidv7 } from 'uuidv7'
import { addressCategoryType } from '../utils/datatypes.js'

export default class AuthService {
  async auth(email: string, password: string) {
    try {
      const user = await User.query()
        .preload('profile', (query) => {
          query.preload('routes')
        })
        .where({ email, active: true })
        .first()

      if (!user) {
        throw new Error('Invalid credentials')
      }

      const isPasswordValid = await validHash(password, user.password)

      if (!isPasswordValid) {
        throw new Error('Invalid credentials')
      }

      // apagar tokens antigos
      await db.rawQuery(`delete from auth_access_tokens where tokenable_id = ${user.id}`)

      // Criando um token de acesso corretamente
      const token = await User.accessTokens.create(user)

      const userData = {
        id: user.id,
        customerId: user.customerId,
        publicId: user.publicId,
        cpfCnpj: user.cpfCnpj,
        name: user.name,
        email: user.email,
        profile: user.profile,
        token,
      }

      return userData
    } catch (error) {
      throw error
    }
  }

  async verifyUser({ id }: User) {
    try {
      const user = await User.query()
        .preload('profile', (query) => {
          query.preload('routes')
        })
        .where({ id })
        .first()

      if (!user) {
        throw new Error('Invalid user!')
      }

      // Criando um token de acesso corretamente
      const token = await User.accessTokens.create(user)

      return {
        ...user.$attributes,
        ...user.$preloaded,
        token,
      }
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new Error('Usuário não encontrado') // ou lance um erro customizado
      }
      throw error
    }
  }

  async register(input: { userPayload: User; AddressPayload: Address }) {
    const { userPayload, AddressPayload } = input
    try {
      const profile = await Profile.query().where({ type: 'ADVOGADO' }).first()

      if (!profile) {
        throw new Error('Profile not found')
      }

      //verificar se já não existe um usuário com o mesmo email
      const userExists = await User.query().where({ email: userPayload.email }).first()

      if (userExists && userExists.active) {
        throw new Error('User already exists')
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
        ...userPayload,
        profileId: profile.id,
      })

      if (AddressPayload) {
        await Address.create({
          addressCity: AddressPayload.addressCity,
          addressComplement: AddressPayload.addressComplement,
          addressDistrict: AddressPayload.addressDistrict,
          addressNumber: AddressPayload.addressNumber,
          addressState: AddressPayload.addressState,
          addressStreet: AddressPayload.addressStreet,
          addressZipcode: AddressPayload.addressZipcode,
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
      throw error
    }
  }

  async activeAccount(token: string) {
    const tokenExists = await UserToken.query().where({ token }).first()

    if (!tokenExists) {
      throw new Error('Token not found')
    }

    const expired = dayjs().isAfter(dayjs(tokenExists?.expiresAt))

    if (expired) {
      throw new Error('Token expired')
    }

    //localizar o usuário
    const user = await User.query().where({ id: tokenExists.userId }).first()

    //se não existir o usuário dar erro
    if (!user) {
      throw new Error('User not found')
    }

    //se o usuário ativar o usuário
    try {
      user.merge({
        active: true,
      })

      //persistir os dados no banco
      await user.save()

      //apagar todos os tokens do usuário
      await UserToken.query().delete().where({ userId: user.id })
    } catch (error) {
      //se der erro ao ativar o usuário, apagar o token
      throw new Error('Error activating user')
    }
  }

  async forgotActivateLink(token: string) {
    try {
      const tokenExists = await UserToken.query().where({ token }).first()

      if (!tokenExists) {
        throw new Error('Token not found')
      }

      const user = await User.query().where({ id: tokenExists.userId }).first()

      if (!user) {
        throw new Error('User not found')
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
      throw error
    }
  }

  async forgotPassword(email: string) {
    const user = await User.query().where({ email, active: true }).first()
    if (!user) {
      throw new Error('User not found')
    }

    try {
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
      //se der erro ao ativar o usuário, apagar o token
      throw new Error('Error creating token for password reset')
    }
  }

  async renewPassword(token: string, password: string) {
    if (!password) {
      throw new Error('Password is required')
    }

    if (!token) {
      throw new Error('Token is required')
    }

    //verificar se o token existe
    const tokenExists = await UserToken.query().where({ token }).first()

    if (!tokenExists) {
      throw new Error('Token not found')
    }

    //verificar se o token não está expirado
    const expired = dayjs().isAfter(dayjs(tokenExists.expiresAt))
    if (expired) {
      throw new Error('Token expired')
    }

    //localizar o usuário
    const user = await User.query().where({ id: tokenExists.userId }).first()

    //se não existir o usuário dar erro
    if (!user) {
      throw new Error('User not found')
    }

    try {
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
      //se der erro ao ativar o usuário, apagar o token
      throw new Error('Error updating password')
    }
  }
}
