import moment from "moment";

export default defineNuxtRouteMiddleware((to) => {
  const stoken = localStorage.getItem("token");

  // se não tem um token e não esta no login então expulsa para o login
  if (
    !stoken &&
    //!openUrls.includes(to.path)
    to.path !== "/"
    // to.path !== "/signup" &&
    // !to.path.includes("/login-client") &&
    // !to.path.includes("/activate-account") &&
    // !to.path.includes("/activate-account/suc0cess") &&
    // !to.path.includes("/terms")
  ) {
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
        return navigateTo("/home-admin");
      }
    } catch {
      console.log("Erro ao verificar token");
      return navigateTo("/");
    }
  }
});
