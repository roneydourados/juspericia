export interface UserProps {
  id?: number;
  profileId?: number;
  email?: string;
  name?: string;
  password?: string;
  phone?: string;
  cpfCnpj?: string;
  officeName?: string;
  oab?: string;
  oabUf?: string;
  crm?: string;
  crmUf?: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  Profile?: UserProfileProps;
}

export interface UserProfileProps {
  id?: number;
  profileName?: string;
  type?: ProfileType;
  ProfileRoute?: UserRoutesProps[];
  isAdmin?: boolean;
}

export interface UserRoutesProps {
  id?: number;
  profileId?: number;
  title?: string;
  to?: string;
  icon?: string;
  visible?: boolean;
  isMenu?: boolean;
}

const profileType = ["ADMIN", "ADVOGADO", "MEDICO"] as const;

export type ProfileType = (typeof profileType)[number];

const paymentType = ["CREDIT_CARD", "PIX", "BOLETO"] as const;

export type PaymentType = (typeof paymentType)[number];
