import { update } from "./repository/consultationRepository";
import { ConsultationProps } from "@/types/Consultation";

export default defineEventHandler(async (event) => {
  const body = await readBody<ConsultationProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
