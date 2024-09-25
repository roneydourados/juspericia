import { PatientConsultationReportProps } from "@/types/PatientConsultationReport";
import { index } from "./repository/patientConsultationReportRepository";

export default defineEventHandler(async (event) => {
  let userId = undefined;

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  if (user.Profile!.type !== "ADMIN" && user.Profile!.type !== "MEDICO") {
    userId = Number(user.id);
  }

  const { initialDate, finalDate } = getQuery(event);

  setResponseStatus(event, 200);

  return index({
    initialDate: String(initialDate),
    finalDate: String(finalDate),
    userId,
  });
});
