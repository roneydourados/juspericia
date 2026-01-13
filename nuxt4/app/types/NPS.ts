export interface NPSProps {
  id: number;
  publicId: string;
  userId: number;
  patientConsultationId: number;
  evaluationId: number | null;
  npsPhase: number;
  monthReference: string;
  isEligible: boolean;
  isCompleted: boolean;
  presentedAt: string | null;
  expiredAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  patientConsultation: SolicitationConsultationProps;
}

export interface NPSCreateProps {
  eligibility_id: number;
  rating: number;
  feedback_text?: string;
}
