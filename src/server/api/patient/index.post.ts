import { create } from "./repository/patientRepository";
import { PatientProps } from "@/types/Patient";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<PatientProps>(event);

  setResponseStatus(event, 200);

  return create({
    ...body,
    userId: user.id,
  });
});
