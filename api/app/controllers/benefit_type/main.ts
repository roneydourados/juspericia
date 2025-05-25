import type { HttpContext } from '@adonisjs/core/http'
import { BenefitTypeService } from '#services/index'
import {
  benefitTypeStoreValidator,
  benefitTypeUpdateValidator,
} from '#validators/benefit_type/main'
import { inject } from '@adonisjs/core'

@inject()
export default class BenefitTypeController {
  constructor(private benefitTypeService: BenefitTypeService) {}

  public async index({ request }: HttpContext) {
    const { query } = request.qs()
    return this.benefitTypeService.index(query)
  }

  public async show({ params }: HttpContext) {
    return this.benefitTypeService.show(params.publicId)
  }

  public async store({ request }: HttpContext) {
    const { name } = request.all()
    const payload = await benefitTypeStoreValidator.validate({ name })

    return this.benefitTypeService.create({ name: payload.name })
  }

  public async update({ request }: HttpContext) {
    const { name, publicId } = request.all()

    const payload = await benefitTypeUpdateValidator.validate({ name, publicId })

    return this.benefitTypeService.update({ name: payload.name!, publicId: payload.publicId! })
  }

  public async destroy({ params }: HttpContext) {
    const { publicId } = params
    return this.benefitTypeService.destroy(publicId)
  }
}
