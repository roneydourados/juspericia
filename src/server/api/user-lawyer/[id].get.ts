import { show } from "@/server/repositories/userLawyerRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  return show(id);
});
