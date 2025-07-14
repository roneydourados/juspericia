export interface VoucherFilterProps {
  initialDate: string;
  finalDate: string;
  status?: string;
  sellerId?: string;
}
export interface VoucherFormProps {
  id?: number;
  publicId?: string;
  voucherName: string;
  description: string;
  discount: string;
  useQuantity: string;
  discountType: string;
  expirationDate: string;
  status?: string;
  voucherUseCount?: number;
  voucherUsePersonalizedSale?: boolean;
  seller?: UserProps;
  user?: UserProps;
  voucherItems: VoucherItemsProps[];
}

export interface VoucherItemsProps {
  id?: number;
  itemId?: number;
  publicId?: string;
  name?: string;
  urlImage?: string;
  description?: string;
  value?: number;
  status?: string;
  dueDays?: number;
  isChecked?: boolean;
  itemType?: string;
  servicePackage?: ServicePackagesProps;
}
