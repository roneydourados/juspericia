export interface SolicitationConsultationProps {
  id?: number;
  patientId?: number;
  userId?: number;
  medicId?: number;
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
  deadline?: string;
  rate?: number;
  Medic?: UserProps;
  Patient?: PatientProps;
  Consultation?: ConsultationProps;
  ReportPurpose?: ReportPurposeProps;
  BenefitType?: BenefitTypeProps;
}
