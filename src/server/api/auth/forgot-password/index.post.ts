import { forgotPassword } from "@/server/repositories/authRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email } = body;

  setResponseStatus(event, 200);

  return forgotPassword(String(email));
});
