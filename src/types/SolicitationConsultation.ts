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

export interface SolicitationConsultationFilterProps {
  initialDateSolicitation: string;
  finalDateSolicitation: string;
  status: string;
  patientId?: number;
  benefitTypeId?: number; //tipo de benefício
  reportPurposeId?: number; //finalidade do laudo
  benefitType?: BenefitTypeProps;
  patient?: PatientProps;
  reportPurpose?: ReportPurposeProps;
}
