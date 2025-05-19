import { ReportModel } from '#models/index'
import { ReportModelProps } from '../dtos/index.js'
export default class ReportModelService {
  async create({ title, content }: ReportModelProps) {
    try {
      const reportModel = await ReportModel.create({
        title,
        content,
      })

      return reportModel
    } catch (error) {
      console.error('Error creating report model:', error)
      throw error
    }
  }

  async update({ publicId, title, content }: ReportModelProps) {
    try {
      const reportModel = await ReportModel.query().where({ publicId }).firstOrFail()

      reportModel.merge({ title, content })

      await reportModel.save()

      return reportModel
    } catch (error) {
      console.error('Error updating report model:', error)
      throw error
    }
  }

  async delete(publicId: string) {
    try {
      const reportModel = await ReportModel.query().where('publicId', publicId).firstOrFail()

      await reportModel.delete()

      return reportModel
    } catch (error) {
      console.error('Error deleting report model:', error)
      throw error
    }
  }

  async index(inputQuery: string) {
    const reportModels = await ReportModel.query().if(inputQuery, (q) => {
      if (inputQuery) {
        q.where('title', 'ILIKE', `%${inputQuery}%`)
      }
    })

    return reportModels
  }

  async show(publicId: string) {
    const reportModel = await ReportModel.query().where('publicId', publicId).firstOrFail()

    return reportModel
  }
}
