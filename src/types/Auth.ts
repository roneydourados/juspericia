export interface AuthProps {
  email?: string;
  password?: string;
  tokenCapcha?: string;
  token?: {
    type: string;
    token: string;
    expires_at: string;
    exp: number;
  };
}
