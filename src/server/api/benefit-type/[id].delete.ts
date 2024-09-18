import { destroy } from "./repository/benefitTypeRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  await destroy(id);
});
