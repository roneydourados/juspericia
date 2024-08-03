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
  tipValue?: number;
  dateOpen?: string;
  dateClose?: string;
  Patient?: PatientProps;
  Consultation?: ConsultationProps;
  ReportPurpose?: ReportPurposeProps;
  BenefitType?: BenefitTypeProps;
}
