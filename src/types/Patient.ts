export interface PatientProps {
  id?: number;
  userId?: number;
  name?: string;
  surname?: string;
  email?: string;
  motherName?: string;
  phone?: string;
  cpf?: string;
  rg?: string;
  status?: string;
  birthDate?: string;
  sexy?: string;
  proccessNumber?: string;
  benefitTypeId?: number;
  reportPurposeId?: number;
  ReportPurpose?: ReportPurposeProps;
  BenefitType?: BenefitTypeProps;
  User?: UserProps;
  PatientConsultation?: SolicitationConsultationProps[];
  Address: AddressProps;
}

export interface ReportPurposeProps {
  id?: number;
  name?: string;
}

export interface ReportModelProps {
  id?: number;
  title?: string;
  content?: string;
}

export interface BenefitTypeProps {
  id?: number;
  name?: string;
}
