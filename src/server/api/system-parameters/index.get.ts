import { index } from "@/server/repositories/systemParametersRepository";

export default defineEventHandler(async (event) => {
  setResponseStatus(event, 200);

  return index();
});
