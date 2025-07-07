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
  medic: string;
  medicCrm: string;
  medicCrmUf: string;
  reportId: number;
  signToken: string;
  signStatus: string;
}
