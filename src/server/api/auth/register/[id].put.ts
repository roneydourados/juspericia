import { activeAccount } from "@/server/repositories/authRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  return activeAccount(id);
});
