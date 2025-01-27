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
  createdAt?: string;
}

export interface UserCreditLog {
  id?: number;
  userCreditId?: number;
  history?: string;
  type?: string;
  value?: number;
  createdAt?: string;
}
