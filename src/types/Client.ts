export interface ClientProps {
  id?: number;
  userId?: number;
  name?: string;
  email?: string;
  phone?: string;
  cpfCnpj?: string;
  rg?: string;
  cnh?: string;
  regionId?: number;
  type?: string;
  status?: string;
  Region?: RegionProps;
}

export interface RegionProps {
  id?: number;
  region?: string;
}
