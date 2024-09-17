import { index } from "./repository/scheduleRepository";

export default defineEventHandler(async (event) => {
  const { medicId, scheduleDate } = getQuery(event);

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const userId = user.Profile.type === "ADMIN" ? undefined : user.id;

  setResponseStatus(event, 200);

  return index({
    medicId: medicId ? Number(medicId) : undefined,
    scheduleDate: scheduleDate ? String(scheduleDate) : undefined,
  });
});
