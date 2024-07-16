import { update } from "./repository/patientRepository";
import { PatientProps } from "@/types/Patient";

export default defineEventHandler(async (event) => {
  const body = await readBody<PatientProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
