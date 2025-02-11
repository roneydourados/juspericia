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
  invoicingYear: InvoicingYearProps[];
  salesStatus: SalesStatusProps[];
}

export interface InvoicingYearProps {
  total: number;
  month: string;
}

export interface SalesStatusProps {
  total: number;
  status: string;
}

export interface AdminDashboardSalesClientsProps {
  quantity: number;
}
