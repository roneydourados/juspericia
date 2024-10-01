import { index } from "@/server/repositories/scheduleRepository";

export default defineEventHandler(async (event) => {
  let userId = undefined;
  const { medicId, scheduleDate, patientId } = getQuery(event);

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  if (user.Profile?.type === "ADMIN") {
    userId = medicId;
  } else {
    userId = user.id;
  }

  setResponseStatus(event, 200);

  return index({
    medicId: userId ? Number(userId) : undefined,
    patientId: patientId ? Number(patientId) : undefined,
    scheduleDate: scheduleDate ? String(scheduleDate) : undefined,
  });
});
