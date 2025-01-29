export interface ServicePackagesProps {
  id?: number;
  publicId?: string;
  name?: string;
  urlImage?: string;
  description?: string;
  value?: number;
  status?: string;
  dueDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicePackagesHistoryProps {
  id?: number;
  publicId?: string;
  packageId?: number;
  description?: string;
  action?: string;
  userId?: number;
  createdAt?: string;
  User?: UserProps;
}
