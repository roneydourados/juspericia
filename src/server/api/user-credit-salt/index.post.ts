import { UserCreditSalt } from "@/types/UserCredit";
import { create } from "@/server/repositories/userCreditSaltRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<UserCreditSalt>(event);

  setResponseStatus(event, 200);

  return create({
    ...body,
    userId: Number(user.id),
  });
});
