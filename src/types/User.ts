export interface UserProps {
  id?: number;
  profileId?: number;
  email?: string;
  name?: string;
  password?: string;
  phone?: string;
  cpfCnpj?: string;
  officeName?: string;
  officePhone?: string;
  officeEmail?: string;
  officeCnpj?: string;
  oab?: string;
  oabUf?: string;
  crm?: string;
  crmUf?: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  Profile?: UserProfileProps;
  Address?: AddressProps;
  publicId?: string;
  medicConsultationValue?: number;
  customerId?: string;
  whatsapp?: string;
  tokenCapcha?: string;
}

export interface UserProfileProps {
  id?: number;
  profileName?: string;
  type?: ProfileType;
  ProfileRoute?: UserRoutesProps[];
  isAdmin?: boolean;
  publicId?: string;
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

export interface UserModelProps {
  id?: number;
  name: string;
  email: string;
  cpfCnpj: string;
  password: string;
  confirmPassword: string;
  phone: string;
  whatsapp: string;
  oab: string;
  oabUf: string;
  officeName: string;
  active: boolean;
  cepAddress: CepAdderssProps;
  officePhone: string;
  officeEmail: string;
  officeCnpj: string;
  tokenCapcha: string;
}

export interface UserMedicModelProps {
  id?: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  crm: string;
  crmUf: string;
  active: boolean;
  cepAddress: CepAdderssProps;
}

const profileType = ["ADMIN", "ADVOGADO", "MEDICO"] as const;

export type ProfileType = (typeof profileType)[number];

const paymentType = ["CREDIT_CARD", "PIX", "BOLETO"] as const;

export type PaymentType = (typeof paymentType)[number];
