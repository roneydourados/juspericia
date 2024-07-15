import moment from "moment";

export default defineNuxtRouteMiddleware((to) => {
  const stoken = localStorage.getItem("token");
  const auth = useAuthStore();

  // se não tem um token e não esta no login então expulsa para o login
  if (!stoken && to.path !== "/") {
    console.log(to.path);
    return navigateTo("/");
  }

  if (stoken) {
    try {
      const token = JSON.parse(stoken);

      const tokenExpires = moment(token.expires_at).isBefore(new Date());

      // se tem o token e esta expirado então expulsa para o login
      if (tokenExpires) {
        localStorage.removeItem("token");
        return navigateTo("/");
      }

      if (to.path === "/") {
        if (auth.$currentUser?.Profile.type === "ADMIN") {
          return navigateTo("/home-admin");
        } else if (auth.$currentUser?.Profile.type === "ADVOGADO") {
          return navigateTo("/home-lawyer");
        } else if (auth.$currentUser?.Profile.type === "MEDICO") {
          return navigateTo("/home-medic");
        }
      }
    } catch {
      console.log("Erro ao verificar token");
      return navigateTo("/");
    }
  }
});
