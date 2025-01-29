import { WebHookPaymentResponseProps } from "~/lib/asaas/types/WebhookPayment";
import { paymentWebhook } from "~/server/repositories/asaasRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<WebHookPaymentResponseProps>(event);

  setResponseStatus(event, 200);

  await paymentWebhook(body);

  return { received: true };
});
