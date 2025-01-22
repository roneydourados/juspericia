import { register } from "@/server/repositories/authRepository";
import { UserProps } from "@/types/User";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserProps>(event);

  const { tokenCapcha } = body;

  if (!tokenCapcha) {
    throw createError({
      statusCode: 422,
      statusMessage: "Token not provided.",
    });
  }

  const validTokenCapcha = await verifyTurnstileToken(tokenCapcha);

  if (!validTokenCapcha.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid token Capcha.",
    });
  }

  setResponseStatus(event, 201);

  return register(body);
});
