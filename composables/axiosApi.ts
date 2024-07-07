import axios from "axios";

export const useAxios = () => {
  const config = useRuntimeConfig();

  const baseURL = config.public.baseUrl as string;

  const api = axios.create({
    baseURL,
  });

  //interceptor no request para informar se tem um token a enviar na autenticação do header
  api.interceptors.request.use(
    function (config) {
      const stoken = localStorage.getItem("token");

      if (stoken) {
        const token = JSON.parse(stoken);

        config.headers.Authorization = `Bearer ${token.token}`;
      }

      return config;
    },
    function (error) {
      if (
        error.response.status === 401 ||
        error.response.status === 403
        //error.response.status === 404
      ) {
        //const auth = useAuthStore();

        //auth.logout();

        console.log("Session Expired!!!", error.response);

        navigateTo("/");
      } else {
        return Promise.reject(error);
      }
    }
  );

  api.interceptors.response.use(
    function (response) {
      const config = response.config as any;

      switch (config.method) {
        case "post":
          push.success({
            message: "Enviado com sucesso!",
            duration: 2000,
          });

          break;
        case "put":
          push.success({
            message: "Enviado com sucesso!",
            duration: 2000,
          });

          break;
        case "patch":
          push.success({
            message: "Enviado com sucesso!",
            duration: 2000,
          });

          break;
        case "delete":
          push.success({
            message: "Enviado com sucesso!",
            duration: 2000,
          });

          break;
      }

      return response;
    },
    function (error) {
      const config = error.config;

      switch (config.method) {
        case "post":
          push.error({
            message: "Oops ocorreu um erro!",
            duration: 3000,
          });
          break;
        case "put":
          push.error({
            message: "Oops ocorreu um erro!",
            duration: 3000,
          });
          break;
        case "patch":
          push.error({
            message: "Oops ocorreu um erro!",
            duration: 3000,
          });
          break;
        case "delete":
          push.error({
            message: "Oops ocorreu um erro!",
            duration: 3000,
          });
          break;
      }

      if (
        error.response.status === 401 ||
        error.response.status === 403
        //error.response.status === 404
      ) {
        //const auth = useAuthStore();

        //auth.logout();

        console.log("Session Expired!!!", error.response);

        navigateTo("/");
      } else {
        return Promise.reject(error);
      }
    }
  );

  return { api };
};
