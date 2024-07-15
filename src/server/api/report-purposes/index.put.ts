import { update } from "./repository/reportPurposeRepository";
import { ReportPurposeProps } from "@/types/Patient";

export default defineEventHandler(async (event) => {
  const body = await readBody<ReportPurposeProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
