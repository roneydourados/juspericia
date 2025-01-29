import { update } from "@/server/repositories/userIndicationRepository";

import { UserIndicationProps } from "~/types/UserIndication";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserIndicationProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
