export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  //const screen = useScreenStore();
  const stoken = localStorage.getItem("token");

  if (auth.$currentUser && stoken) {
    // if (to.path.includes("/activate-account/success")) {
    //   return;
    // }

    // const userRoute = auth.$currentUser.Profile.ProfileRoute?.find(
    //   (route) => route.to === to.path && route.visible === true
    // );

    // const isValidRoute = userRoute ? true : false;

    // if (to.path !== "/profile" && !isValidRoute) {
    //   return navigateTo("/");
    // }

    try {
      //se esta tudo ok com token então verificar se a rota acessada é liberada para o usário

      const userRoute = auth.$currentUser.Profile.ProfileRoute?.find(
        (route) => {
          let pathUrl = "";
          if (Object.keys(to.params).length > 0) {
            pathUrl = to.path.replace(/\/[^\/]*$/, "");
          } else {
            pathUrl = to.path.replace(/\/\d+$/, "");
          }

          //const \pathUrl = to.path.replace(/\/[^\/]*$/, "");

          console.log("🚀 ~ pathUrl:", pathUrl);
          if (route.to === pathUrl && route.visible) {
            return route;
          }
        }
      );

      const isValidRoute = userRoute ? true : false;

      //screen.setScreen(userRoute?.title ?? "");

      if (!isValidRoute) {
        const userRouteLib = auth.$currentUser.Profile.ProfileRoute?.find(
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
