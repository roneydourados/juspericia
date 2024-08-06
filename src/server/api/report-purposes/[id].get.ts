import { show } from "./repository/reportPurposeRepository";

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params!.id) as number;

  setResponseStatus(event, 200);

  return show(id);
});
