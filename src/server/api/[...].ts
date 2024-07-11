import { apiVersion } from "@/server/utils/Constants";

import * as serviceAuth from "@/server/services/authService";
import * as serviceProfile from "@/server/services/profileService";

const router = createRouter();

//profile
router.post("/profile", defineEventHandler(serviceProfile.create));

// auth
router.post("/auth", defineEventHandler(serviceAuth.login));
router.post("/auth/register", defineEventHandler(serviceAuth.register));
router.post(
  "/auth/verify-user/:id",
  defineEventHandler(serviceAuth.verifyUser)
);

export default useBase(apiVersion.verson1, router.handler);
