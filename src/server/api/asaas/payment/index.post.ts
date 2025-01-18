import { createPayment } from "@/server/repositories/asaasRepository";
import { PaymentAsaasProps } from "~/lib/asaas/types/Payment";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<PaymentAsaasProps>(event);

  setResponseStatus(event, 200);

  return createPayment(body, user.id!);
});
