import { ReportModelProps } from "@/types/Patient";
import { create } from "./repository/reportModelRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<ReportModelProps>(event);

  setResponseStatus(event, 200);

  return create(body);
});
