import { create } from "./repository/patientRepository";
import { PatientProps } from "@/types/Patient";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);
  let userId = undefined;

  const body = await readBody<PatientProps>(event);

  if (user.Profile.type === "ADMIN") {
    userId = body.userId;
  } else {
    userId = user.id;
  }

  setResponseStatus(event, 200);

  return create({
    ...body,
    userId,
  });
});
