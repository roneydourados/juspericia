import { getSolicitationPatient } from "@/server/repositories/solicitationConsultationRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  return getSolicitationPatient(Number(id));
});
