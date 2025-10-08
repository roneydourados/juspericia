export interface PatientConsultationReportProps {
  id?: number;
  userId?: number;
  patientConsultationId?: number;
  content?: string;
  publicId?: string;
  status?: string;
  deletedAt?: string;
  userDeleted?: string;
  reportDate?: string;
  Medic?: UserProps;
  PatientConsultation?: SolicitationConsultationProps;
  attachments?: FileProps[];
  justifies?: PatientConsultationsReportJustifyProps[];
  atendentId?: number;
}

export interface PatientConsultationsReportJustifyProps {
  id?: number;
  userJustifyId?: number;
  patientConsultationReportId?: number;
  justify: string;
  createdAt?: string;
  user?: UserProps;
}

export interface PatientConsultationReportListProps {
  id: number;
  publicId: string;
  patient: string;
  cpf: string;
  benefitType: string;
  reportPurpose: string;
  dateOpen: string;
  dateClose: string;
  reportContent: string;
  reportDate: string;
  reportPublicId: string;
  reportStatus: string;
  medicId: number;
  medic: string;
  medicCrm: string;
  medicCrmUf: string;
  reportId: number;
  signToken: string;
  signStatus: string;
  reasonCorrection?: string;
  justifyId?: number;
  attachments?: FileProps[];
  nuvidioCallId?: string;
}
