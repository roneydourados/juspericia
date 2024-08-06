import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import { JWTDecodedProps } from "~/types/JWTDecoded";
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

  return { login, verifyUser, logout, $currentUser };
});
