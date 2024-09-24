import { ScheduleProps } from "@/types/Schedule";
import { create } from "./repository/scheduleRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<ScheduleProps>(event);

  setResponseStatus(event, 200);

  return create({
    ...body,
    userSchedule: user.name,
  });
});
