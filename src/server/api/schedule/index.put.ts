import { ScheduleProps } from "~/types/Schedule";
import { update } from "./repository/scheduleRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<ScheduleProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
