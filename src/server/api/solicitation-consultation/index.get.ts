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

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const userId = user.Profile.type === "ADMIN" ? undefined : user.id;

  setResponseStatus(event, 200);

  return index({
    initialDateSolicitation,
    finalDateSolicitation,
    status,
    benefitTypeId,
    patientId,
    reportPurposeId,
    userId,
  });
});
