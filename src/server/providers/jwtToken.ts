import jwt from "jsonwebtoken";
import { UserProps } from "@/types/User";

export const useJwtToken = () => {
  const config = useRuntimeConfig();

  const issuer = "app.token.issuer.juspericia";
  const audience = "app.token.audience.juspericia";
  const secret = config.tokenSecret as string;

  const createToken = (payload: UserProps) => {
    const token = jwt.sign(
      {
        data: payload,
      },
      secret,
      {
        expiresIn: "1 days",
        subject: payload.id!.toString(),
        issuer,
        audience,
      }
    );

    return token;
  };

  const verifyToken = (token: string) => {
    try {
      jwt.verify(token, secret, {
        issuer,
        audience,
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  const tokenData = (token: string) => {
    try {
      return jwt.verify(token, secret ?? "", {
        issuer,
        audience,
      });
    } catch (error) {
      return {
        id: 0,
        email: "",
        name: "",
      };
    }
  };

  return { createToken, verifyToken, tokenData };
};
