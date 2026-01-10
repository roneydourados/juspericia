export interface SolicitationConsultationList {
  consultations: SolicitationConsultationProps[];
  totals: ConsultationListTotals[];
}

interface ConsultationListTotals {
  status: string;
  total: number;
}
export interface SolicitationConsultationProps {
  id?: number;
  patientId?: number;
  userId?: number;
  medicId?: number | null;
  consultationId?: number;
  content?: string;
  benefitTypeId?: number;
  reportPurposeId?: number;
  status?: string;
  processSituation?: string;
  proccessNumber?: string;
  tipValue?: number;
  dateOpen?: string;
  dateClose?: string;
  dateAntecipation?: string;
  dateCorrection?: string;
  reasonCorrection?: string;
  createdAt?: string;
  updatedAt?: string;
  isSolicitationCorrection?: boolean;
  consultationValue?: number;
  antecipationValue?: number;
  valueCredit?: number;
  deadline?: string;
  rate?: number;
  Medic?: UserProps;
  Patient?: PatientProps;
  Consultation?: ConsultationProps;
  ReportPurpose?: ReportPurposeProps;
  BenefitType?: BenefitTypeProps;
  Schedule?: ScheduleProps[];
  publicId?: string;
  isTelemedicine?: boolean;
  PatientConsultationReport?: PatientConsultationReportProps;
  sale?: SaleProps;
  files?: FileProps[];
  correctionQuantity?: number;
  medicalSpecialtyId?: number;
  medicalSpecialty?: MedicalSpecialtyProps;
  medicalSpecialtyValue?: number;
  antecipationHours?: number;
  criticisms?: PatientConsultationCriticismsProps[];
  corrections?: SolicitationCorrectionProps[];
  showMedicalSpeciality?: boolean;
}

export interface SolicitationCorrectionProps {
  id?: number;
  publicId?: string;
  patientConsultationId: number;
  correctionReason: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export interface SolicitationConsultationFilterProps {
  initialDateSolicitation: string;
  finalDateSolicitation: string;
  status: string;
  patientId?: number;
  benefitTypeId?: number; //tipo de benefício
  reportPurposeId?: number; //finalidade do laudo
  userId?: number;
  benefitType?: BenefitTypeProps;
  patient?: PatientProps;
  reportPurpose?: ReportPurposeProps;
  lawyer?: UserProps;
  publicId?: string;
  medicIsNull?: boolean;
  number?: number;
}

export interface SolicitationReportProps {
  id: number;
  publicId: string;
  medic: string;
  lawyer: string;
  patient: string;
  status: string;
  benefitType: string;
  reportPurpose: string;
  processSituation: string;
  medicalSpecialty: string;
  processNumber: string;
  solicitationValue: number;
  medicalSpecialtyValue: number;
  total: number;
  dateOpen: string;
  dateClose: string;
}
