import { userLogCredit } from "@/server/repositories/userCreditRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  return userLogCredit(id);
});
