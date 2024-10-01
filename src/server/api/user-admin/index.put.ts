import { UserProps } from "@/types/User";
import { update } from "@/server/repositories/userAdminRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
