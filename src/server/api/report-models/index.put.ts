import { update } from "./repository/reportModelRepository";
import { ReportModelProps } from "@/types/Patient";

export default defineEventHandler(async (event) => {
  const body = await readBody<ReportModelProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});