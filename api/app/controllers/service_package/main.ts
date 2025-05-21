import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { ServicePackageService } from '#services/index'
import { createValidator, updateValidator } from '#validators/service_package/main'

@inject()
export default class ServicePackageController {
  constructor(private servicePackageService: ServicePackageService) {}

  async index({ request, response }: HttpContext) {
    const { status } = request.qs()

    const servicePackages = await this.servicePackageService.getServicePackages(status)

    return response.json(servicePackages)
  }

  async store({ request, response }: HttpContext) {
    const data = request.body()

    const payload = await createValidator.validate(data)

    const servicePackage = await this.servicePackageService.create(payload)

    return response.json(servicePackage)
  }

  async update({ request, response }: HttpContext) {
    const data = request.body()

    const payload = await updateValidator.validate(data)

    const servicePackage = await this.servicePackageService.update(payload)

    return response.json(servicePackage)
  }

  async destroy({ params, response }: HttpContext) {
    const { id } = params

    const servicePackage = await this.servicePackageService.destroy(id)

    return response.json(servicePackage)
  }

  async getHistory({ params, response }: HttpContext) {
    const { id } = params

    const servicePackage = await this.servicePackageService.getHistory(id)

    return response.json(servicePackage)
  }
}
