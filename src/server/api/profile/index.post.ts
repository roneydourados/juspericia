import { create } from "./repository/profileRepository";
import { UserProfileProps } from "@/types/User";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserProfileProps>(event);

  setResponseStatus(event, 201);

  return create(body);
});
