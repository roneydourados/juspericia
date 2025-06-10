export interface VoucherFormProps {
  id?: number;
  publicId?: string;
  voucherName: string;
  description: string;
  discount: string;
  discountType: string;
  expirationDate: string;
  status?: string;
  seller?: UserProps;
  packages: VoucherItemsProps[];
}

export interface VoucherItemsProps {
  id?: number;
  publicId?: string;
  name?: string;
  urlImage?: string;
  description?: string;
  value?: number;
  status?: string;
  dueDays?: number;
  isChecked?: boolean;
  itemType?: string;
}
