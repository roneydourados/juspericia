import { create } from "./repository/reportModelRepository";
import { ReportModelProps } from "@/types/Patient";

export default defineEventHandler(async (event) => {
  console.log("🚀 ~ defineEventHandler ~ event:", event);
  const body = await readBody<ReportModelProps>(event);
  console.log("🚀 ~ defineEventHandler ~ body:", body);

  setResponseStatus(event, 200);

  return create(body);
});
