import { getServicePackages } from "~/server/repositories/servicePackageRepository";

export default defineEventHandler(async (event) => {
  setResponseStatus(event, 200);

  await getServicePackages();
});
