import { getCustomer } from "@/server/repositories/asaasRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  setResponseStatus(event, 200);

  if (user && user.cpfCnpj) {
    return getCustomer(String(user.cpfCnpj));
  }

  return [];
});
