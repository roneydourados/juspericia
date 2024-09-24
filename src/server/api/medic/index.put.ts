import { UserProps } from "@/types/User";
import { update } from "./repository/medicRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
