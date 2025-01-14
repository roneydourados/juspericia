import { UserProps } from "@/types/User";
export interface UserCreditSalt {
  id?: number;
  userId?: number;
  salt?: number;
  saleId?: number;
  saltCategory?: string;
  expiredAt?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  publicId?: string;
  status?: string;
  type?: string;
  User?: UserProps;
  UserLogCredit?: UserCreditLog[];
  UserCreditPayment?: UserCreditPayment[];
}

export interface UserCreditLog {
  id?: number;
  saleId?: number;
  userId?: number;
  history?: string;
  type?: string;
  value?: number;
  createdAt?: string;
}

export interface UserCreditPayment {
  id?: number;
  creditSaltId?: number;
  paymentForm?: string;
  value?: number;
  chargeId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
