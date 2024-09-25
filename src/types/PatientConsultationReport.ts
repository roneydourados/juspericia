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
}
