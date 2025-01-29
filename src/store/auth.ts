import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import { JWTDecodedProps } from "@/types/JWTDecoded";
import { AuthProps } from "@/types/Auth";

export const useAuthStore = defineStore("auth", () => {
  const { api } = useAxios();

  const currentUser = ref<JWTDecodedProps | null>(null);

  const $currentUser = computed(() => {
    const stoken = localStorage.getItem("token");

    if (stoken) {
      const token = JSON.parse(stoken);

      currentUser.value = token
        ? jwtDecode<JWTDecodedProps>(token.token)
        : null;
    }

    return currentUser.value?.data;
  });

  const login = async ({ email, password, tokenCapcha }: AuthProps) => {
    const resp = await api.post<AuthProps>("/auth", {
      email,
      password,
      tokenCapcha,
    });

    localStorage.setItem("token", JSON.stringify(resp.data.token));

    currentUser.value = resp.data.token?.token
      ? jwtDecode<JWTDecodedProps>(resp.data.token?.token)
      : null;
  };

  const verifyUser = async (id: number) => {
    const resp = await api.get<AuthProps>(`/auth/verify-user/${id}`);

    if (resp.data.token) {
      localStorage.removeItem("token");
      localStorage.setItem("token", JSON.stringify(resp.data.token));

      currentUser.value = resp.data.token.token
        ? jwtDecode<JWTDecodedProps>(resp.data.token.token)
        : null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  //efetuar cadastro/registro de um novo usuário
  const register = async (payload: UserProps) => {
    await api.post<UserProps>("/auth/register", payload);
  };

  //ativar a conta com o token válido
  const activeAccount = async (token: string) => {
    await api.put(`/auth/register/${token}`);
  };

  // caso o token tenha expirado, reenviar um novo email para ativação
  const forgotActiveLink = async (token: string) => {
    await api.post(`/auth/register/forgot-activate-link/${token}`);
  };

  // enviar um email para redefinir a senha
  const forgotPasswordLink = async (email: string) => {
    await api.post("/auth/forgot-password", { email });
  };

  //redefinir a senha
  const resetPassword = async (token: string, payload: UserProps) => {
    await api.post(`/auth/renew-password/${token}`, payload);
  };

  return {
    $currentUser,
    login,
    verifyUser,
    logout,
    register,
    activeAccount,
    forgotActiveLink,
    forgotPasswordLink,
    resetPassword,
  };
});
