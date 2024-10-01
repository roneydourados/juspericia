import { SolicitationConsultationFilterProps } from "@/types/SolicitationConsultation";
import { index } from "@/server/repositories/solicitationConsultationRepository";

export default defineEventHandler(async (event) => {
  const {
    initialDateSolicitation,
    finalDateSolicitation,
    status,
    benefitTypeId,
    patientId,
    reportPurposeId,
    userId,
  } = getQuery<SolicitationConsultationFilterProps>(event);

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const userIdGet = user.Profile?.type === "ADMIN" ? userId : user.id;

  setResponseStatus(event, 200);

  return index({
    initialDateSolicitation,
    finalDateSolicitation,
    status,
    benefitTypeId,
    patientId,
    reportPurposeId,
    userId: userIdGet ? Number(userIdGet) : undefined,
  });
});
