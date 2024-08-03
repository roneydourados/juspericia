import { consultationShow } from "./repository/solicitationConsultationRepository";

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params!.id) as number;

  setResponseStatus(event, 200);

  await consultationShow(id);
});
