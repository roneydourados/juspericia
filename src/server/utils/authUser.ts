import { H3Event } from "h3";
import { useJwtToken } from "../providers/jwtToken";
import { JwtPayload } from "jsonwebtoken";

export const useAuthUser = () => {
  const { tokenData, verifyToken } = useJwtToken();

  const userLogged = (event: H3Event) => {
    const headers = getHeaders(event);

    if (!headers.authorization) {
      throw createError({
        statusCode: 403,
        statusMessage: "Unathorized",
      });
    }

    //pegar dados do usuário logado
    try {
      const valid = verifyToken(headers.authorization.split(" ")[1]);

      if (!valid) {
        throw createError({
          statusCode: 403,
          statusMessage: "Unathorized",
        });
      }

      const token = tokenData(
        headers.authorization.split(" ")[1]
      ) as JwtPayload;

      return token.data;
    } catch (error) {
      throw createError({
        statusCode: 403,
        statusMessage: "Unathorized",
      });
    }
  };

  return { userLogged };
};
