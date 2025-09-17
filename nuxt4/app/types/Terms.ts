export interface TermsProps {
  id?: number;
  content: string;
  category: string;
  version?: string;
  createdAt?: Date;
}

export interface MedicalTermsProps {
  conductManual: TermsProps;
  medicalServiceContract: TermsProps;
}
