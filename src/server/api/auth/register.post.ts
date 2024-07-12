import { register } from "./repository/authRepository";
import { UserProps } from "@/types/User";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserProps>(event);

  setResponseStatus(event, 201);

  return register(body);
});
