import { show } from "./repository/patientRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  console.log("🚀 ~ defineEventHandler ~ id:", id);

  setResponseStatus(event, 200);

  return show(id);
});
