import { create } from "@/server/repositories/medicRepository";
import { UserProps } from "@/types/User";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserProps>(event);

  setResponseStatus(event, 200);

  return create(body);
});
