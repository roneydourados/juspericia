import { update } from "./repository/reportModelRepository";
import { ReportModelProps } from "@/types/Patient";

export default defineEventHandler(async (event) => {
  const body = await readBody<ReportModelProps>(event);
  console.log("🚀 ~ defineEventHandler ~ body:", body);

  setResponseStatus(event, 200);

  return update(body);
});
