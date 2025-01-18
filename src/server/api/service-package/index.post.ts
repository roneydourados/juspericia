import { create } from "~/server/repositories/servicePackageRepository";
import { ServicePackagesProps } from "~/types/ServicePackages";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  const body = await readBody<ServicePackagesProps>(event);

  setResponseStatus(event, 200);

  await create(body, user);
});
