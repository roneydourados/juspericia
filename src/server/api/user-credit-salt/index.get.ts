import { index } from "./repository/userCreditSaltRepository";

export default defineEventHandler(async (event) => {
  const { isExpired } = getQuery(event);

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  setResponseStatus(event, 200);

  return index({
    userId: user.id,
    isExpired: isExpired ? Boolean(isExpired) : undefined,
  });
});
