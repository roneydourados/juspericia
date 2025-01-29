import { index } from "@/server/repositories/userIndicationRepository";
import moment from "moment";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const { initialDate, finalDate, status } = getQuery(event);

  setResponseStatus(event, 200);

  return index({
    userId: user.id!,
    initialDate: initialDate
      ? String(initialDate)
      : moment().startOf("month").format("YYYY-MM-DD"),
    finalDate: finalDate
      ? String(finalDate)
      : moment().endOf("month").format("YYYY-MM-DD"),
    status: status ? String(status) : undefined,
  });
});
