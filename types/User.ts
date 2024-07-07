export interface UserProps {
  id?: number;
  profileId?: number;
  email?: string;
  name?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
}

export interface UserProfile {
  id?: number;
  profile?: string;
  UserRoutes?: UserRoutesProps[];
  isAdmin?: boolean;
}

export interface UserRoutesProps {
  id?: number;
  userId?: number;
  title?: string;
  to?: string;
  icon?: string;
  visible?: boolean;
  isMenu?: boolean;
}
