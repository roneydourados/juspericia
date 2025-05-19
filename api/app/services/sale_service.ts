import { Sale } from '#models/index'

export default class SaleService {
  async create({
    publicId,
    saleId,
    billingType,
    dueDate,
    dateCreated,
    description,
    invoiceUrl,
    status,
    userId,
    value,
    netValue,
    nossoNumero,
    originalDueDate,
    category,
    packageId,
    solicitationId,
  }: Sale) {
    try {
      const sale = await Sale.create({
        publicId,
        saleId,
        billingType,
        dueDate,
        dateCreated,
        description,
        invoiceUrl,
        status,
        userId,
        value,
        netValue,
        nossoNumero,
        originalDueDate,
        category,
        packageId,
        solicitationId,
      })

      return sale
    } catch (error) {
      console.error('Error creating sale:', error)
      throw error
    }
  }

  async getSalesUser(input: {
    userId: number
    initialDate: string
    finalDate: string
    status?: string
  }) {
    const { userId, initialDate, finalDate, status } = input

    const sales = await Sale.query()
      .where({ userId })
      .whereBetween('date_created', [initialDate, finalDate])
      .if(status, (q) => {
        if (status !== 'all' && status) {
          q.where('status', status)
        }
      })

    return sales
  }
}
