import { useJwtToken } from "../providers/jwtToken";
import { apiVersion } from "@/server/utils/Constants";

const openEndpoints = [
  `${apiVersion.verson1}/auth`,
  `${apiVersion.verson1}/auth/register`,
  `${apiVersion.verson1}/profile`,
];

export default defineEventHandler((event) => {
  const { verifyToken } = useJwtToken();

  // se não contem /api significa que é roda do lado client, então deixar passar!
  const clientSideRoutes = !event.path.includes("/api");

  // if (clientSideRoutes) {
  //   return;
  // }

  // se for um endpoint liberado então passar
  if (openEndpoints.includes(event.path) || clientSideRoutes) {
    return;
  }

  // caso contrário verificar se existe autorização
  const headers = getHeaders(event);

  if (!headers.authorization) {
    throw createError({
      statusCode: 403,
      statusMessage: "No Bear Token Unathorized",
    });
  }

  //se existe autorização então validar o token enviado
  try {
    const valid = verifyToken(headers.authorization.split(" ")[1]);

    if (!valid) {
      throw createError({
        statusCode: 403,
        statusMessage: "Unathorized is not valid token",
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unathorized missing token",
    });
  }
});
