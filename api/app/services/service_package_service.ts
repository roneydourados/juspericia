import { ServicePackage } from '#models/index'
import { ServicePackagesProps } from '../dtos/index.js'
export default class ServicePackageService {
  async create({ name, value, description, urlImage, dueDays }: ServicePackagesProps) {
    try {
      const servicePackage = await ServicePackage.create({
        name,
        value,
        description,
        urlImage,
        dueDays,
      })
      return servicePackage
    } catch (error) {
      console.error('Error creating service package:', error)
      throw error
    }
  }

  async update({ name, value, description, urlImage, dueDays, publicId }: ServicePackagesProps) {
    try {
      const service = await ServicePackage.query().where({ publicId }).firstOrFail()

      service.merge({
        name,
        value,
        description,
        urlImage,
        dueDays,
      })

      await service.save()

      return service
    } catch (error) {
      console.error('Error creating service package:', error)
      throw error
    }
  }

  async destroy(publicId: string) {
    try {
      const service = await ServicePackage.query().where({ publicId }).firstOrFail()

      await service.delete()

      return service
    } catch (error) {
      console.error('Error creating service package:', error)
      throw error
    }
  }

  async getServicePackages(status: string) {
    try {
      const servicePackages = await ServicePackage.query()
        .where({ status })
        .orderBy('createdAt', 'desc')

      return servicePackages
    } catch (error) {
      console.error('Error creating service package:', error)
      throw error
    }
  }

  async getHistory(publicId: string) {
    try {
      const servicePackage = await ServicePackage.query()
        .where({ publicId })
        .preload('ServicePackageHistory')
        .first()

      return servicePackage
    } catch (error) {
      console.error('Error creating service package:', error)
      throw error
    }
  }
}
