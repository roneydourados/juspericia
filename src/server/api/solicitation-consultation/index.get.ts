import { index } from "./repository/solicitationConsultationRepository";

export default defineEventHandler(async (event) => {
  //const { inputQuery } = getQuery(event);

  setResponseStatus(event, 200);

  return index();
});
