import dayjs from "dayjs";

export default defineNuxtRouteMiddleware((to) => {
  const stoken = localStorage.getItem("token");
  const auth = useAuthStore();

  const existsFreeRoute =
    to.path.includes("/activate-account/") ||
    to.path.includes("/activate-account/success") ||
    to.path.includes("/activate-account/error") ||
    to.path.includes("/activate-account/error/") ||
    to.path.includes("/forgot-password") ||
    to.path.includes("/forgot-password/renew") ||
    to.path.includes("/forgot-password/renew/") ||
    to.path.includes("/terms") ||
    to.path.includes("/register") ||
    to.path.startsWith("/teleconference") ||
    to.path.startsWith("/room");
  // to.path.startsWith("/consent-terms") ||
  // to.path.startsWith("/terms-first-login");

  if (existsFreeRoute) {
    return;
  }

  if (!stoken && to.path !== "/") {
    return navigateTo("/");
  }

  if (stoken) {
    try {
      const token = JSON.parse(stoken);

      const tokenExpires = dayjs(token.expiresAt).isBefore(new Date());

      // se tem o token e esta expirado então expulsa para o login
      if (tokenExpires) {
        localStorage.removeItem("token");
        return navigateTo("/");
      }

      if (
        !auth.$currentUser?.userConsent &&
        !to.path.startsWith("/consent-terms")
      ) {
        return navigateTo("/consent-terms");
      }

      // // Se o usuário está em /consent-terms mas já tem consentimento, redirecionar
      // if (auth.$currentUser?.consent && to.path.startsWith("/consent-terms")) {
      //   return navigateTo("/");
      // }

      if (to.path === "/") {
        if (auth.$currentUser?.profile?.type === "ADMIN") {
          return navigateTo("/admin/home");
        } else if (auth.$currentUser?.profile?.type === "ADVOGADO") {
          return navigateTo("/lawyer/home");
        } else if (auth.$currentUser?.profile?.type === "MEDICO") {
          return navigateTo("/medic/home");
        } else if (auth.$currentUser?.profile?.type === "ATENDENTE") {
          return navigateTo("/atendent/home");
        } else if (
          auth.$currentUser?.profile?.type === "VENDEDOR" ||
          auth.$currentUser?.profile?.type === "GERENTE"
        ) {
          return navigateTo("/seller/home");
        }
      }
    } catch {
      console.log("Erro ao verificar token");
      return navigateTo("/");
    }
  }
});
