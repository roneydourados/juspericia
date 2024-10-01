import { index } from "@/server/repositories/patientRepository";

export default defineEventHandler(async (event) => {
  const { inputQuery } = getQuery(event);

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const userId =
    user.Profile?.type === "ADMIN" || user.Profile?.type === "MEDICO"
      ? undefined
      : user.id;

  setResponseStatus(event, 200);

  return index({ inputQuery: String(inputQuery), userId });
});
