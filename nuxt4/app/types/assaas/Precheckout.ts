export interface AssasPreCheckoutProps {
  name: string;
  description: string;
  dueDays?: number;
  paymentForm: string;
  installmentCount?: number;
  discount?: number;
  itemValue: number;
  totalValue?: number;
  totalBruteValue?: number;
  category: string;
  packageId?: number;
  solicitationId?: number;
  voucherId?: number;
  voucherDesconto: string;
  discountValue?: number;
  discountType?: string;
}
