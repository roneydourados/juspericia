import { UserProps } from "~/types/User";
import { update } from "./repository/userLawyerRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});