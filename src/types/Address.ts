export interface AddressProps {
  id?: number;
  addressZipcode?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressDistrict?: string;
  addressCity?: string;
  addressState?: string;
  addressComplement?: string;
  ownerId?: number;
  addressType?: string;
}

export const ADDRESS_USER = "USER";
export const ADDRESS_CLIENT = "CLIENT";
