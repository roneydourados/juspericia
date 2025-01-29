import { ScheduleProps } from "@/types/Schedule";
import { update } from "@/server/repositories/scheduleRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<ScheduleProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
