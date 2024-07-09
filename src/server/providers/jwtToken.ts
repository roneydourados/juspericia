import jwt from "jsonwebtoken";
import { UserProps } from "@/types/User";

export const useJwtToken = () => {
  const config = useRuntimeConfig();

  const issuer = config.public.tokenIssuer as string;
  const audience = config.public.tokenAudiance as string;
  const secret = config.public.tokenSecret as string;

  const createToken = ({
    email,
    name,
    id,
    stripeSubscriptionId,
    stripeCustomerId,
    stripePriceId,
    stripeSubscriptionStatus,
    active,
    ownerId,
    userType,
    clientId,
    years,
    UserRoutes,
    plan,
  }: UserProps) => {
    return jwt.sign(
      {
        data: {
          email,
          name,
          id,
          stripeSubscriptionId,
          stripeCustomerId,
          stripePriceId,
          stripeSubscriptionStatus,
          active,
          ownerId,
          userType,
          clientId,
          years,
          UserRoutes,
          plan,
        },
      },
      secret,
      {
        expiresIn: "1 days",
        subject: id!.toString(),
        issuer,
        audience,
      }
    );
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
        email: "",
        name: "",
        id: 0,
        stripeSubscriptionId: "",
        stripeCustomerId: "",
        stripePriceId: "",
        stripeSubscriptionStatus: "",
        plan: "",
        active: false,
        ownerId: 0,
        userType: "",
        clientId: 0,
      };
    }
  };

  return { createToken, verifyToken, tokenData };
};
