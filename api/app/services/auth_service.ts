import { User, Profile, UserToken, Address } from '#models/index'
import { EmailService } from '#services/index'

import { validHash } from './hash.js'
import db from '@adonisjs/lucid/services/db'
import axios from 'axios'
import dayjs from 'dayjs'
import { uuidv7 } from 'uuidv7'
import env from '#start/env'
import { addressCategoryType } from '../utils/datatypes.js'

import { UserProps } from '../dtos/index.js'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthService {
  constructor(private emailService: EmailService) {}

  async auth(email: string, password: string) {
    try {
      const user = await User.query()
        .preload('profile', (query) => {
          query.preload('routes')
        })
        .where({ email, active: true })
        .firstOrFail()

      const isPasswordValid = await validHash(password, user.password ?? '')

      if (!isPasswordValid) {
        throw new Error('Invalid credentials')
      }

      // apagar tokens antigos
      await db.rawQuery(`delete from auth_access_tokens where tokenable_id = ${user.id}`)

      // Criando um token de acesso corretamente
      const token = await User.accessTokens.create(user)

      const userData = {
        token,
        id: user.id,
        customerId: user.customerId,
        publicId: user.publicId,
        cpfCnpj: user.cpfCnpj,
        name: user.name,
        email: user.email,
        profile: user.profile,
      }

      return userData
    } catch (error) {
      throw error
    }
  }

  async verifyUser({ id }: UserProps) {
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

  async register(payload: UserProps) {
    try {
      const profile = await Profile.query().where({ type: 'ADVOGADO' }).first()

      if (!profile) {
        throw new Error('Profile not found')
      }

      //verificar se já não existe um usuário com o mesmo email
      const userExists = await User.query().where({ email: payload.email }).first()

      if (userExists && userExists.active) {
        throw new Error('User already exists')
      }

      const expiresAt = dayjs().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')

      if (userExists && !userExists.active) {
        await UserToken.query().delete().where({ userId: userExists.id })

        //token temporário para ativação de conta
        const userToken = await UserToken.create({
          userId: userExists.id,
          token: uuidv7(),
          expiresAt,
        })

        //enviar email com o token para o usuário
        await this.emailService.sendMail({
          email: userExists.email,
          name: userExists.name,
          office: userExists.officeName,
          template: 'email',
          linkConfirmation: `${env.get('APP_URL')}/activate-account/${userToken.token}`,
        })
      }

      // Remove createdAt and updatedAt if present in payload to avoid type errors
      //const { createdAt, updatedAt, ...userPayload } = payload

      const user = await User.create({
        ...payload,
        profileId: profile.id,
      })

      if (payload.UserAddress) {
        await Address.create({
          addressCity: payload.UserAddress.addressCity,
          addressComplement: payload.UserAddress.addressComplement,
          addressDistrict: payload.UserAddress.addressDistrict,
          addressNumber: payload.UserAddress.addressNumber,
          addressState: payload.UserAddress.addressState,
          addressStreet: payload.UserAddress.addressStreet,
          addressZipcode: payload.UserAddress.addressZipcode,
          ownerId: user.id,
          addressCategory: addressCategoryType.user,
        })
      }

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

      //token expirar em 3 minutos
      const expiresAt = dayjs().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')

      //apagar qualquer token antigo do usuário
      await UserToken.query().delete().where({ userId: user.id })

      //token temporário para ativação de conta
      const userToken = await UserToken.create({
        userId: user.id,
        token: uuidv7(),
        expiresAt,
      })

      //enviar email com o token para o usuário
      await this.emailService.sendMail({
        email: user.email,
        name: user.name,
        office: user.officeName,
        template: 'email',
        linkConfirmation: `${env.get('APP_URL')}/activate-account/${userToken.token}`,
      })

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
      //apagar qualquer token antigo do usuário
      await UserToken.query().delete().where({ userId: user.id })

      //expirar token em 3 minutos
      const expiresAt = dayjs().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss')

      //token temporário para ativação de conta
      const userToken = await UserToken.create({
        userId: user.id,
        token: uuidv7(),
        expiresAt,
      })

      //enviar email com o token para o usuário
      await this.emailService.sendMail({
        email: user.email,
        name: user.name,
        office: user.officeName,
        template: 'passwrod',
        linkConfirmation: `${env.get('APP_URL')}/forgot-password/renew/${userToken.token}`,
      })
    } catch (error) {
      console.log('🚀 ~ error forgot password:', error)
      throw new Error(`Error forgot password ${error.message}`)
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

  async verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
    const secret = env.get('TURNSTILE_SECRET_KEY', '')

    const api = axios.create()

    try {
      const { data } = await api.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        new URLSearchParams({
          secret: secret ?? '',
          response: token,
          remoteip: ip,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return data.success === true
    } catch (error) {
      console.error('Erro ao verificar Turnstile:')
      return false
    }
  }
}
