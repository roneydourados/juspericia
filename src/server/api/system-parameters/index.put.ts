import { update } from "@/server/repositories/systemParametersRepository";
import { SystemParametersProps } from "~/types/SystemParameters";

export default defineEventHandler(async (event) => {
  const body = await readBody<SystemParametersProps>(event);

  setResponseStatus(event, 200);

  return update(body);
});
