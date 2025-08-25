export interface UserCreditSalt {
  id?: number;
  publicId?: string;
  ownerId?: number;
  userId?: number;
  creditDate?: string;
  expireDate?: string;
  value?: string;
  salt?: string;
  category?: string;
  status?: string;
  transactionReceiptUrl?: string;
  invoiceUrl?: string;
  createdAt?: string;
  saleId?: string;
  description?: string;
  saleValue?: number;
  user?: UserProps;
  solicitationConsultationValue?: number;
}

export interface UserCreditLog {
  id?: number;
  userCreditId?: number;
  history?: string;
  type?: string;
  value?: number;
  createdAt?: string;
}

export interface UserCreditSaltResponseProps {
  totals: {
    total: number;
    totalExpired: number;
    totalPending: number;
  };
  credits: UserCreditSalt[];
}
