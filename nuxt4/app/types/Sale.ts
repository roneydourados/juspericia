export interface SaleProps {
  id?: number;
  saleId?: string;
  userId?: number;
  dateCreated?: string;
  dueDate?: string;
  publicId?: string;
  originalDueDate?: string;
  description?: string;
  nossoNumero?: string;
  value?: number;
  netValue?: number;
  billingType?: string;
  status?: string;
  confirmedDate?: string;
  paymentDate?: string;
  transactionReceiptUrl?: string;
  invoiceUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  localStatus?: string;
  expiredAt?: string;
  salt?: number;
  category?: string;
  packageId?: number;
  solicitationId?: number;
  sellerId?: number;
  packgeQuantity?: number;
  packgeSaleValue?: number;
  saleType?: string;
  discountValue?: number;
  discountType?: string;
  SaleWebhookEvents?: SaleWebhookEventProps[];
}

export interface SaleFilterProps {
  initialDate?: string;
  finalDate?: string;
  status?: string;
  userId?: number;
}

export interface SaleWebhookEventProps {
  payId: string;
  event: string;
  description: string;
  billingType: string;
  netValue: number;
  value: number;
  status: string;
  reason: string;
  content: string;
  createdAt: string;
}
