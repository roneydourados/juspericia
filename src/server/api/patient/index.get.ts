import { index } from "./repository/patientRepository";

export default defineEventHandler(async (event) => {
  const { inputQuery } = getQuery(event);

  setResponseStatus(event, 200);

  return index(String(inputQuery));
});