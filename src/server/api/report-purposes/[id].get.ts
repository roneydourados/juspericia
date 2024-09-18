import { show } from "./repository/reportPurposeRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  return show(id);
});
