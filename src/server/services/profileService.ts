import { H3Event } from "h3";
import * as repository from "@/server/repositories/profileRepository";
import { UserProfileProps } from "@/types/User";

export const create = async (event: H3Event) => {
  const body = await readBody<UserProfileProps>(event);

  setResponseStatus(event, 200);

  return repository.create(body);
};
