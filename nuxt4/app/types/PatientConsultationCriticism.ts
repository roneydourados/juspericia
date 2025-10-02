export interface PatientConsultationCriticismsProps {
  id?: number;
  userId?: number;
  patientConsultationId: number;
  description: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  messages?: PatientConsultationCriticismsMessagesProps[];
}

export interface PatientConsultationCriticismsMessagesProps {
  id?: number;
  patientConsultationCriticismId: number;
  userId: number;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientConsultationCriticismsList {
  criticisms: PatientConsultationCriticismsProps[];
}

export interface PatientConsultationCriticismsSingle {
  criticism: PatientConsultationCriticismsProps;
}
