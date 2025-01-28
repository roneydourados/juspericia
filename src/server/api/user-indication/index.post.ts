import { create } from "@/server/repositories/userIndicationRepository";

import { UserIndicationProps } from "~/types/UserIndication";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<UserIndicationProps>(event);

  setResponseStatus(event, 200);

  return create({
    ...body,
    userId: user.id!,
  });
});
