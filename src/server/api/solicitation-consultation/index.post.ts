import { SolicitationConsultationProps } from "@/types/SolicitationConsultation";
import { consultationCreate } from "./repository/solicitationConsultationRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<SolicitationConsultationProps>(event);

  setResponseStatus(event, 200);

  return consultationCreate({
    ...body,
    userId: user.id,
  });
});
