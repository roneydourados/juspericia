import { index } from "./repository/patientRepository";

export default defineEventHandler(async (event) => {
  const { inputQuery } = getQuery(event);

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const userId = user.Profile.type === "ADMIN" ? undefined : user.id;

  setResponseStatus(event, 200);

  return index({ inputQuery: String(inputQuery), userId });
});
