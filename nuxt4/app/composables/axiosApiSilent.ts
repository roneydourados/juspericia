import axios from "axios";

export const useAxiosSilent = () => {
  const config = useRuntimeConfig();

  const baseURL = config.public.apiBaseUrl as string;

  const apiSilent = axios.create({
    baseURL,
  });

  //interceptor no request para informar se tem um token a enviar na autenticação do header
  apiSilent.interceptors.request.use(
    function (config) {
      const stoken = localStorage.getItem("token");

      if (stoken) {
        const token = JSON.parse(stoken);

        config.headers.Authorization = `Bearer ${token.token}`;
      }

      return config;
    },
    function (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        const auth = useAuthStore();

        auth.logout();

        console.log("Session Expired!!!", error.response);

        navigateTo("/");
      } else {
        return Promise.reject(error);
      }
    }
  );

  apiSilent.interceptors.response.use(
    function (response) {
      //const config = response.config as any;

      return response;
    },
    function (error) {
      const config = error.config;

      // switch (config.method) {
      //   case "post":
      //     push.error({
      //       message: "Oops ocorreu um erro!",
      //       duration: 3000,
      //     });
      //     break;
      //   case "put":
      //     push.error({
      //       message: "Oops ocorreu um erro!",
      //       duration: 3000,
      //     });
      //     break;
      //   case "patch":
      //     push.error({
      //       message: "Oops ocorreu um erro!",
      //       duration: 3000,
      //     });
      //     break;
      //   case "delete":
      //     push.error({
      //       message: "Oops ocorreu um erro!",
      //       duration: 3000,
      //     });
      //     break;
      // }

      if (error.response.status === 401 || error.response.status === 403) {
        const auth = useAuthStore();

        auth.logout();

        console.log("Session Expired!!!", error.response);

        navigateTo("/");
      } else {
        return Promise.reject(error);
      }
    }
  );

  return { apiSilent };
};
