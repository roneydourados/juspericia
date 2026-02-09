export interface FinanceFiltersProps {
  initialDate: string;
  finalDate: string;
  status?: string;
  financeType?: string;
}

export interface FinanceProps {
  id?: number;
  publicId?: string;
  categoryId?: number;
  emissionDate?: string;
  dueDate?: string;
  description?: string;
  value?: number;
  valueOpen?: number;
  financeType?: string;
  status?: string;
  category?: any;
}
