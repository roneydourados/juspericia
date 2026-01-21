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

export interface NPSDashboardMetricsDTO {
  overview: {
    totalEvaluations: number;
    averageRating: number;
    npsScore: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  byPhase: {
    phase: number;
    totalEvaluations: number;
    averageRating: number;
    npsScore: number;
  }[];
  byMonth: {
    month: string;
    totalEvaluations: number;
    averageRating: number;
    npsScore: number;
  }[];
  topMedics: {
    medicId: number;
    medicName: string;
    average: number;
    count: number;
  }[];
  topSpecialties: {
    specialtyId: number;
    specialtyName: string;
    average: number;
    count: number;
  }[];
  topBestEvaluations: {
    rating: number;
    medicName: string;
    solicitationId: number;
    specialtyName: string;
    feedbackText: string;
  }[];
  topWorstEvaluations: {
    rating: number;
    medicName: string;
    solicitationId: number;
    specialtyName: string;
    feedbackText: string;
  }[];
  years: number[];
}
