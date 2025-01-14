import { getSaleUser } from "@/server/repositories/saleRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const { initialDate, finalDate, status } = getQuery(event);

  setResponseStatus(event, 200);

  return getSaleUser({
    userId: user.id,
    initialDate: initialDate ? String(initialDate) : undefined,
    finalDate: finalDate ? String(finalDate) : undefined,
    status: status ? String(status) : undefined,
  });
});
