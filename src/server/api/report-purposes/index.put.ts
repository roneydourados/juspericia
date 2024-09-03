import { ReportPurposeProps } from "~/types/ReportPurpose";
import { update } from "./repository/reportPurposeRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<ReportPurposeProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
