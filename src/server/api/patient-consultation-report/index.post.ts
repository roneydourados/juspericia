import { PatientConsultationReportProps } from "@/types/PatientConsultationReport";
import { create } from "./repository/patientConsultationReportRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<PatientConsultationReportProps>(event);

  setResponseStatus(event, 200);

  return create({
    ...body,
    userId: user.id,
    userDeleted: user.name, // aqui é para garantir que o usuário que deletou o relatório seja registrado caso já exista um relatório com o mesmo publicId
  });
});
