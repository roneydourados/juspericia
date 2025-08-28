import { defineStore } from "pinia";
// import { jwtDecode } from "jwt-decode";
// import { JWTDecodedProps } from "@/types/JWTDecoded";
// import { jwtDecode } from "jwt-decode";
// import { JWTDecodedProps } from "@/types/JWTDecoded";
import type { AuthProps } from "@/types/Auth";

export const useAuthStore = defineStore("auth", () => {
  const { api } = useAxios();

  const currentUser = ref<AuthProps | null>(null);
  const userUpdateTrigger = ref(0); // Trigger para forçar reatividade

  const $currentUser = computed(() => {
    // Força a reatividade quando userUpdateTrigger muda
    userUpdateTrigger.value;

    const sUser = localStorage.getItem("user");

    if (sUser) {
      const user = JSON.parse(sUser);
      currentUser.value = user;
    }

    return currentUser.value;
  });

  const login = async ({ email, password, tokenCapcha }: AuthProps) => {
    const resp = await api.post<AuthProps>("/auth", {
      email,
      password,
      tokenCapcha,
    });

    if (resp.data.token) {
      localStorage.setItem("token", JSON.stringify(resp.data.token));

      currentUser.value = resp.data;

      localStorage.setItem("user", JSON.stringify(resp.data));
      userUpdateTrigger.value++; // Força atualização do computed
    }
  };

  const verifyUser = async (id: string) => {
    const resp = await api.post<AuthProps>(`/auth/verify-user/${id}`);

    if (resp.data.token) {
      currentUser.value = resp.data;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.setItem("token", JSON.stringify(resp.data.token));
      localStorage.setItem("user", JSON.stringify(resp.data));
      userUpdateTrigger.value++; // Força atualização do computed
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    currentUser.value = null;
    userUpdateTrigger.value++; // Força atualização do computed
  };

  //efetuar cadastro/registro de um novo usuário
  const register = async (payload: UserProps) => {
    await api.post<UserProps>("/auth/register", payload);
  };

  //ativar a conta com o token válido
  const activeAccount = async (token: string) => {
    await api.put(`/auth/active-account/${token}`);
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

  const consentTerms = async (tokenCapcha: string) => {
    await api.post("/auth/consent-terms", { tokenCapcha });
  };

  const revokeConset = async (publicId: string) => {
    await api.post(`/auth/revoke-consent/${publicId}`);
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
    consentTerms,
    revokeConset,
  };
});
