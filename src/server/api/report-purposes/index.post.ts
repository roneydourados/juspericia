import { ReportPurposeProps } from "@/types/ReportPurpose";
import { create } from "./repository/reportPurposeRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<ReportPurposeProps>(event);

  setResponseStatus(event, 200);

  return create(body);
});
