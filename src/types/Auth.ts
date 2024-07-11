export interface AuthProps {
  email?: string;
  password?: string;
  token?: {
    type: string;
    token: string;
    expires_at: string;
    exp: number;
  };
}
