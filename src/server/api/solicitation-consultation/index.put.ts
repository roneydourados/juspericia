import { SolicitationConsultationProps } from "@/types/SolicitationConsultation";
import { consultationUpdate } from "@/server/repositories/solicitationConsultationRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<SolicitationConsultationProps>(event);

  setResponseStatus(event, 200);

  return consultationUpdate(body);
});
