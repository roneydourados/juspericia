export interface AssasPreCheckoutProps {
  name: string;
  description: string;
  dueDays?: number;
  paymentForm: string;
  discount?: number;
  installmentCount?: number;
  itemValue: number;
  totalValue?: number;
  totalBruteValue?: number;
  category: string;
  packageId?: number;
  solicitationId?: number;
  voucherDesconto: string;
}
