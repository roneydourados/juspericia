import { destroy } from "~/server/repositories/servicePackageRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  await destroy(id, user);
});
