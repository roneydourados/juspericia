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

export interface LawyerSolicitationEstatisticsByAdmin {
  id: number;
  patient: string;
  dateOpen: string;
  dateClose: string | null;
  reportPurpose: string;
  benefitType: string;
  consultationName: string;
  valueCredit: number;
  total: number;
  medicalSpecialtyValue: number;
  status: string;
  statusName: string;
}

export interface LawyerSolicitationStatusEstatisticsByAdmin {
  quantity: number;
  status: string;
}

export interface LawyerSolicitationBenefitTypeEstatisticsByAdmin {
  quantity: number;
  benefitType: string;
}

export interface LawyerSolicitationReportPurposeEstatisticsByAdmin {
  quantity: number;
  reportPurpose: string;
}

export interface UserCreditLogDto {
  history: string;
  type: string;
  value: string;
  userCreditId: number;
  createdAt: string;
  id: number;
}

export interface UserCreditDto {
  id: number;
  value: string;
  salt: string;
  status: string;
  UserCreditLog: UserCreditLogDto[];
}

export interface LawyerDashboardEstatisticsByAdmin {
  laywerSolicitations: LawyerSolicitationEstatisticsByAdmin[];
  laywerSolicitationsStatus: LawyerSolicitationStatusEstatisticsByAdmin[];
  laywerSolicitationsBenefitType: LawyerSolicitationBenefitTypeEstatisticsByAdmin[];
  laywerSolicitationsReportPropurse: LawyerSolicitationReportPurposeEstatisticsByAdmin[];
  totalSaltCreditExpired: number;
  totalSaltCredit: number;
  totalSaltCreditPending: number;
  userCredit: UserCreditDto[];
}
