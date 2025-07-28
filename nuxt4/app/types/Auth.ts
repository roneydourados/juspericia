// export interface AuthProps {
//   email?: string;
//   password?: string;
//   tokenCapcha?: string;
//   token?: {
//     type: string;
//     token: string;
//     expires_at: string;
//     exp: number;
//   };
// }

export interface AuthProps {
  token?: Token;
  id?: number;
  tokenCapcha?: string;
  password?: string;
  customerId?: string;
  publicId?: string;
  cpfCnpj?: string;
  name?: string;
  email?: string;

  profile?: Profile;
}

export interface Token {
  type: string;
  name: any;
  token: string;
  abilities: string[];
  lastUsedAt: any;
  expiresAt: string;
}

export interface Profile {
  id: number;
  publicId: string;
  profileName: string;
  type: string;
  routes: Route[];
}

export interface Route {
  id: number;
  profileId: number;
  title: string;
  to: string;
  icon: string;
  visible: boolean;
  isMenu: boolean;
}
