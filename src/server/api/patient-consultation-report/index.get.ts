import { index } from "@/server/repositories/patientConsultationReportRepository";

export default defineEventHandler(async (event) => {
  const { initialDate, finalDate, userId, medicId } = getQuery(event);

  let userIdApi = undefined;
  let medicIdApi = undefined;

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  // OS ADVOGADOS PODEM VER TODOS OS LAUDOS DE TODOS OS MÉDICOS, POREM SOMENTE DAS SUAS PRÓPRIAS CONSULTAS
  if (user.Profile!.type === "ADVOGADO") {
    userIdApi = Number(user.id);
  }

  // OS MÉDICOS SÓ PODEM VER SEUS PRÓPRIOS LAUDOS
  if (user.Profile!.type === "MEDICO") {
    medicIdApi = Number(user.id);
  }

  // SE FOR UM USUÁRIO ADMINISTRADOR VAI PODER PASSAR QUAL ID DE USUÁRIO E MEDICO DESEJA CONSULTAR
  if (user.Profile!.type === "ADMIN") {
    userIdApi = userId ? Number(userId) : undefined;
    medicIdApi = medicId ? Number(medicId) : undefined;
  }

  setResponseStatus(event, 200);

  return index({
    initialDate: String(initialDate),
    finalDate: String(finalDate),
    userId: userIdApi,
    medicId: medicIdApi,
  });
});
