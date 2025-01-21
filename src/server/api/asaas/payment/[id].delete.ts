import { deletePayment } from "@/server/repositories/asaasRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  return deletePayment(id);
});
