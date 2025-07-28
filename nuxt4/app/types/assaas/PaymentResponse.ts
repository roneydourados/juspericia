export interface PaymentAsaasResponseProps {
  object: string;
  id: string;
  dateCreated: string;
  customer: string;
  subscription: any;
  installment: any;
  paymentLink: any;
  value: number;
  netValue: number;
  originalValue: any;
  interestValue: any;
  description: string;
  billingType: string;
  creditCard: CreditCard;
  canBePaidAfterDueDate: boolean;
  pixTransaction: any;
  pixQrCodeId: any;
  status: string;
  dueDate: string;
  originalDueDate: string;
  paymentDate: any;
  clientPaymentDate: any;
  installmentNumber: any;
  invoiceUrl: string;
  invoiceNumber: string;
  externalReference: string;
  deleted: boolean;
  anticipated: boolean;
  anticipable: boolean;
  creditDate: string;
  estimatedCreditDate: string;
  transactionReceiptUrl: any;
  nossoNumero: string;
  bankSlipUrl: string;
  discount: Discount;
  fine: Fine;
  interest: Interest;
  split: Split[];
  postalService: boolean;
  daysAfterDueDateToRegistrationCancellation: any;
  chargeback: Chargeback;
  refunds: Refund[];
}

export interface CreditCard {
  creditCardNumber: string;
  creditCardBrand: string;
  creditCardToken: any;
}

export interface Discount {
  value: number;
  dueDateLimitDays: number;
  type: string;
}

export interface Fine {
  value: number;
}

export interface Interest {
  value: number;
}

export interface Split {
  id: string;
  walletId: string;
  fixedValue: number;
  percentualValue: any;
  totalValue: number;
  cancellationReason: string;
  status: string;
  externalReference: any;
  description: any;
}

export interface Chargeback {
  id: string;
  payment: string;
  installment: string;
  customerAccount: string;
  status: string;
  reason: string;
  disputeStartDate: string;
  value: number;
  paymentDate: string;
  creditCard: CreditCard2;
  disputeStatus: string;
  deadlineToSendDisputeDocuments: string;
}

export interface CreditCard2 {
  number: string;
  brand: string;
}

export interface Refund {
  dateCreated: string;
  status: string;
  value: number;
  endToEndIdentifier: any;
  description: any;
  effectiveDate: string;
  transactionReceiptUrl: any;
  refundedSplits: RefundedSplit[];
}

export interface RefundedSplit {
  id: string;
  value: number;
  done: boolean;
}
