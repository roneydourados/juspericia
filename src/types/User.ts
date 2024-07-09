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
}

export interface UserProfile {
  id?: number;
  profile?: string;
  UserRoutes?: UserRoutesProps[];
  isAdmin?: boolean;
}

export interface UserRoutesProps {
  id?: number;
  userId?: number;
  title?: string;
  to?: string;
  icon?: string;
  visible?: boolean;
  isMenu?: boolean;
}

export type ProfileType =
  | { name: "Administrador"; role: "ADMIN" }
  | { name: "Advogado"; role: "ADVOGADO" }
  | { name: "Médico"; role: "MEDICO" };

export type PaymentType =
  | {
      name: "Cartão de crédito";
      value: "CREDIT_CARD";
    }
  | {
      name: "Pix";
      value: "PIX";
    }
  | {
      name: "Boleto";
      value: "BOLETO";
    };
