export interface UserLawyerEstatisticsProps {
  laywerSolicitations: LawyerQuantityProps[];
  laywerPatientsRegistered: LawyerQuantityProps[];
  laywerInvestment: LawyerQuantityProps[];
  laywerSolicitationsStatus: LawyerSolicitationsStatusProps[];
  laywerSolicitationsBenefitType: LawyerSolicitationsBenefitTypeProps[];
  laywerSolicitationsReportPropurse: LawyerSolicitationsReportPropurseProps[];
  laywerSolicitationsTop10Finished: LawyerSolicitationsTop10FinishedProps[];
}

interface LawyerQuantityProps {
  quantity: number;
  month: string;
}

interface LawyerSolicitationsStatusProps {
  quantity: number;
  status: string;
}

interface LawyerSolicitationsBenefitTypeProps {
  quantity: number;
  benefitType: string;
}

interface LawyerSolicitationsReportPropurseProps {
  quantity: number;
  reportPurpose: string;
}

interface LawyerSolicitationsTop10FinishedProps {
  id: number;
  patient: string;
  dateOpen: string;
  dateClose: string;
  reportPurpose: string;
  benefitType: string;
  consultationName: string;
}

export interface UserLawyerEstatisticsFilterProps {
  initialDate: string;
  finalDate: string;
}
