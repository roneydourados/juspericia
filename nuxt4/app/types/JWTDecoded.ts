import { UserProfileProps } from "./User";

export interface JWTDecodedProps {
  data: {
    id?: number;
    email?: string;
    name?: string;
    publicId?: string;
    cpfCnpj?: string;
    Profile: UserProfileProps;
  };
}
