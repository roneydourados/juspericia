import { SystemParameter } from '#models/index'
import { SystemParametersProps } from '../dtos/index.js'

export default class SystemParameterService {
  async index() {
    try {
      const systemParameters = await SystemParameter.query().first()
      return systemParameters
    } catch (error) {
      console.error('Error fetching system parameters:', error)
      throw error
    }
  }

  async update({
    publicId,
    pointsPerIndication,
    pointsExchange,
    pointsExchangeValue,
    daysPointsExpire,
    comission,
    daysCreditExpire,
    suportWhatsapp,
  }: SystemParametersProps) {
    try {
      const systemParameter = await SystemParameter.query().where({ publicId }).firstOrFail()

      systemParameter.merge({
        pointsPerIndication,
        pointsExchange,
        pointsExchangeValue,
        daysPointsExpire,
        comission,
        daysCreditExpire,
        suportWhatsapp,
      })

      await systemParameter.save()
    } catch (error) {
      console.error('Error updating system parameters:', error)
      throw error
    }
  }
}
