import { cancel } from "../repository/userCreditSaltRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  await cancel(id);
});
