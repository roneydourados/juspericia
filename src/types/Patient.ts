export interface PatientProps {
  id?: number;
  userId?: number;
  name?: string;
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
  PatientConsultation?: PatientConsultationProps[];
  Address: AddressProps;
}

export interface ReportPurposeProps {
  id?: number;
  name?: string;
}

export interface BenefitTypeProps {
  id?: number;
  name?: string;
}

export interface PatientConsultationProps {
  id?: number;
  patientId?: number;
  userId?: number;
  medicId?: number;
  consultationId?: number;
  quantity?: number;
  content?: string;
  Patient?: PatientProps;
}
