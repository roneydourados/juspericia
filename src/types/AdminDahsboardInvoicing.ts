export interface AdminDashboardInvoicingProps {
  totalSales: TotalSalesProps;
  salesPaymentForms: SalesPaymentFormsProps[];
  salesCategories: SalesCategoriesProps[];
  salesClients: SalesClientsProps[];
  salesGeral: SalesGeralProps[];
}

interface TotalSalesProps {
  total: number;
}

interface SalesPaymentFormsProps {
  total: number;
  billingType: string;
}

interface SalesCategoriesProps {
  total: number;
  category: string;
}

interface SalesClientsProps {
  total: number;
  client: string;
}

interface SalesGeralProps {
  client: string;
  dateCreated: string;
  description: string;
  billingType: string;
  total: number;
}
