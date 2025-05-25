import { index } from "@/server/repositories/userIndicationRepository";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const { initialDate, finalDate, status } = getQuery(event);

  setResponseStatus(event, 200);

  return index({
    userId: user.Profile?.type === "ADMIN" ? undefined : user.id!,
    initialDate: initialDate
      ? String(initialDate)
      : dayjs().startOf("month").format("YYYY-MM-DD"),
    finalDate: finalDate
      ? String(finalDate)
      : dayjs().endOf("month").format("YYYY-MM-DD"),
    status: status ? String(status) : undefined,
  });
});
