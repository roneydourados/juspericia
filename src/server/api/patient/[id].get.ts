import { show } from "./repository/patientRepository";

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params!.id) as number;

  setResponseStatus(event, 200);

  return show(id);
});
