export interface AdminDashboardInvoicingProps {
  totalSales: TotalSalesProps;
  salesPaymentForms: SalesPaymentFormsProps[];
  salesCategories: SalesCategoriesProps[];
  salesClients: SalesClientsProps[];
  salesGeral: SalesGeralProps[];
  salesSellers: SalesSellerProps[];
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

interface SalesSellerProps {
  total: number;
  seller: string;
}

interface SalesGeralProps {
  client: string;
  dateCreated: string;
  description: string;
  billingType: string;
  total: number;
}

export interface TransactionProps {
  client: string;
  dateCreated: string;
  description: string;
  billingType: string;
  total: number;
  status: string;
  publicId: string;
}
