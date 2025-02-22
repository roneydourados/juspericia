import { verifyUser } from "@/server/repositories/authRepository";

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params!.id) as number;

  setResponseStatus(event, 200);

  return verifyUser(id);
});
