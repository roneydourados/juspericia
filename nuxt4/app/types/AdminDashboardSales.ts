export interface AdminDashBoardSalesFilterProps {
  initialDate: string;
  finalDate: string;
  ufs?: string[];
}

export interface SalesAdminDashboardProps {
  totalPending: number;
  totalConfirmed: number;
  newClients: number;
  totalClients: number;
  client40DaysSolicitation: number;
  credisToExpire: number;
  invoicingYear: InvoicingYearProps[];
  salesStatus: SalesStatusProps[];
  salesPaymentForm: SalesPaymentFormProps[];
  solicitationConsultationStatus: SolicitationConsultationStatusProps[];
  medicAtendimentHours: AdminDashboardMedicAtendimentHoursProps[];
  medicRate: AdminDashboardMedicRateProps[];
}

export interface InvoicingYearProps {
  total: number;
  month: string;
}

export interface SalesStatusProps {
  total: number;
  status: string;
}
export interface SalesPaymentFormProps {
  total: number;
  payment: string;
}

export interface SolicitationConsultationStatusProps {
  quantity: number;
  status: string;
}

export interface AdminDashboardSalesClientsProps {
  quantity: number;
}

export interface AdminDashboardMedicAtendimentHoursProps {
  medic: string;
  duration: string;
}

export interface AdminDashboardMedicRateProps {
  medic: string;
  rate: number;
}
