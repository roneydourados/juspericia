export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  //const screen = useScreenStore();
  const stoken = localStorage.getItem("token");

  // Rotas que não precisam de verificação de permissão
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
    to.path.startsWith("/room") ||
    to.path.startsWith("/consent-terms") ||
    to.path.startsWith("/terms-first-login");

  if (existsFreeRoute) {
    return;
  }

  if (auth.$currentUser && stoken) {
    try {
      //se esta tudo ok com token então verificar se a rota acessada é liberada para o usário
      const userRoute = auth.$currentUser.profile?.routes?.find((route) => {
        let pathUrl = "";
        if (Object.keys(to.params).length > 0) {
          pathUrl = to.path.replace(/\/[^\/]*$/, "");
        } else {
          pathUrl = to.path.replace(/\/\d+$/, "");
        }

        if (route.to === pathUrl && route.visible) {
          return route;
        }
      });

      const isValidRoute = userRoute ? true : false;

      //screen.setScreen(userRoute?.title ?? "");

      if (!isValidRoute) {
        const userRouteLib = auth.$currentUser.profile?.routes?.find(
          (route) => route.visible === true
        );
        return navigateTo(userRouteLib?.to);
      }
    } catch {
      console.log("Erro ao verificar token");
      return navigateTo("/");
    }
  }
});
