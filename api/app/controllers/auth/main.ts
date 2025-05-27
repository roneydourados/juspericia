import type { HttpContext } from '@adonisjs/core/http'
import { createValidator } from '#validators/user/main'
import { authValidator } from '#validators/auth/main'
import { AuthService } from '#services/index'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthController {
  constructor(private authService: AuthService) {}

  async store({ request, response }: HttpContext) {
    const { email, password, tokenCapcha } = request.only(['email', 'password', 'tokenCapcha'])

    const payload = await authValidator.validate({ email, password, tokenCapcha })

    const isValid = await this.authService.verifyTurnstileToken(tokenCapcha, request.ip())

    if (!isValid) {
      return response.badRequest({ message: 'Falha na verificação do Turnstile.' })
    }

    const auth = await this.authService.auth(payload.email, payload.password)

    return response.json(auth)
  }

  async verifyUser({ params, response }: HttpContext) {
    const { id } = params
    const user = await this.authService.verifyUser(id)
    return response.json(user)
  }

  async register({ request, response }: HttpContext) {
    const data = request.all()

    //validar os dados
    const payload = await createValidator.validate(data)

    const payloadData = {
      userPayload: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        cpfCnpj: payload.cpfCnpj,
        phone: payload.phone,
        oab: payload.oab,
        oabUf: payload.oabUf,
        officeName: payload.officeName,
        officeCnpj: payload.officeCnpj,
        officeEmail: payload.officeEmail,
        officePhone: payload.officePhone,
        whatsapp: payload.whatsapp,
        active: payload.active,
      },

      addressPayload: payload.UserAddress,
    } as any

    const registerUser = await this.authService.register(payloadData)
    return response.json(registerUser)
  }

  async activeAccount({ params, response }: HttpContext) {
    const { token } = params

    const activeAccount = await this.authService.activeAccount(token)
    return response.ok(activeAccount)
  }

  async forgotActivateLink({ params, response }: HttpContext) {
    const { token } = params
    const forgotActivateLink = await this.authService.forgotActivateLink(token)

    return response.json(forgotActivateLink)
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = request.only(['email'])
    const forgotPassword = await this.authService.forgotPassword(email)

    return response.ok(forgotPassword)
  }

  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['password', 'token'])

    const renewPassword = await this.authService.renewPassword(token, password)

    return response.json(renewPassword)
  }
}
