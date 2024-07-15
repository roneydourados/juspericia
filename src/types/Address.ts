export interface AddressProps {
  id?: number;
  ownerId?: number;
  addressCategory?: string;
  addressZipcode?: string;
  addressCity?: string;
  addressDistrict?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressState?: string;
  addressComplement?: string;
}

export const ADDRESS_USER = "USER";
export const ADDRESS_CLIENT = "CLIENT";
