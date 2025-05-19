import { ReportPurpose } from '#models/index'

export default class ReportPurposeService {
  async create({ name }: ReportPurpose) {
    try {
      const reportPurpose = await ReportPurpose.create({
        name,
      })

      return reportPurpose
    } catch (error) {
      console.error('Error creating report purpose:', error)
      throw error
    }
  }

  async update({ publicId, name }: ReportPurpose) {
    try {
      const reportPurpose = await ReportPurpose.query().where('publicId', publicId).firstOrFail()

      reportPurpose.merge({ name })

      await reportPurpose.save()

      return reportPurpose
    } catch (error) {
      console.error('Error updating report purpose:', error)
      throw error
    }
  }

  async destroy(publicId: string) {
    try {
      const reportPurpose = await ReportPurpose.query().where('publicId', publicId).firstOrFail()

      await reportPurpose.delete()

      return reportPurpose
    } catch (error) {
      console.error('Error deleting report purpose:', error)
      throw error
    }
  }

  async index(inputQuery: string) {
    const reportPurposes = await ReportPurpose.query().if(inputQuery, (q) => {
      if (inputQuery) {
        q.where('name', 'ILIKE', `%${inputQuery}%`)
      }
    })

    return reportPurposes
  }

  async show(publicId: string) {
    const reportPurpose = await ReportPurpose.query().where('publicId', publicId).firstOrFail()

    return reportPurpose
  }
}
