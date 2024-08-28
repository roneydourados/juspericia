import { SolicitationConsultationFilterProps } from "~/types/SolicitationConsultation";
import { index } from "./repository/solicitationConsultationRepository";

export default defineEventHandler(async (event) => {
  const {
    initialDateSolicitation,
    finalDateSolicitation,
    status,
    benefitTypeId,
    patientId,
    reportPurposeId,
  } = getQuery<SolicitationConsultationFilterProps>(event);

  setResponseStatus(event, 200);

  return index({
    initialDateSolicitation,
    finalDateSolicitation,
    status,
    benefitTypeId,
    patientId,
    reportPurposeId,
  });
});
