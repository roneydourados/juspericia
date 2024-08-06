import { destroy } from "./repository/benefitTypeRepository";

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params!.id) as number;

  setResponseStatus(event, 200);

  await destroy(id);
});
