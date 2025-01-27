import { SolicitationConsultationProps } from "@/types/SolicitationConsultation";
import { paidConsultationSalt } from "@/server/repositories/solicitationConsultationRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<SolicitationConsultationProps>(event);

  setResponseStatus(event, 200);

  return paidConsultationSalt({
    ...body,
    userId: user.id,
  });
});
