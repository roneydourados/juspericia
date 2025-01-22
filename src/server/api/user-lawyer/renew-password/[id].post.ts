import { renewPassword } from "@/server/repositories/userLawyerRepository";
import { UserProps } from "@/types/User";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  const body = await readBody<UserProps>(event);

  setResponseStatus(event, 200);

  return renewPassword(body, id);
});
