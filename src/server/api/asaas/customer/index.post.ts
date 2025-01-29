import { createCustomer } from "@/server/repositories/asaasRepository";
import { CustomerProps } from "~/lib/asaas/types/Customer";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<CustomerProps>(event);

  setResponseStatus(event, 200);

  if (user) {
    return createCustomer({
      ...body,
      userId: user.id,
    });
  }

  return {};
});
