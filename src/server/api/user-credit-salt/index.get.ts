import { index } from "./repository/userCreditSaltRepository";

export default defineEventHandler(async (event) => {
  const { isExpired, status } = getQuery(event);

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  setResponseStatus(event, 200);

  return index({
    userId: user.id,
    isExpired: isExpired ? Boolean(isExpired) : undefined,
    status: status ? String(status) : undefined,
  });
});
