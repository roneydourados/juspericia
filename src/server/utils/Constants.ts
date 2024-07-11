export const apiVersion = {
  verson1: "/api/v1",
};

// tipagem da prioridade gut gravidade
const profileType = ["ADMIN", "COBRADOR"] as const;

export type ProfileType = (typeof profileType)[number];

export const appRoutes = [
  {
    title: "Home",
    to: "/home-admin",
    icon: "mdi-home-outline",
    visible: true,
    isMenu: true,
    profiles: ["ADMIN"],
  },
  {
    title: "Home",
    to: "/home-lawyer",
    icon: "mdi-home-outline",
    visible: true,
    isMenu: true,
    profiles: ["ADVOGADO"],
  },
  {
    title: "Solicitações",
    to: "/solicitations",
    icon: "mdi-file-document-edit-outline",
    visible: true,
    isMenu: true,
    profiles: ["ADVOGADO", "ADMIN"],
  },
  {
    title: "Home",
    to: "/home-medic",
    icon: "mdi-home-outline",
    visible: true,
    isMenu: true,
    profiles: ["MEDICO"],
  },
  {
    title: "Advogados",
    to: "/lawyer",
    icon: "mdi-account-tie-outline",
    visible: true,
    isMenu: true,
    profiles: ["ADMIN"],
  },
  {
    title: "Pacientes",
    to: "/patient",
    icon: "mdi-account-multiple-outline",
    visible: true,
    isMenu: true,
    profiles: ["ADMIN", "ADVOGADO", "MEDICO"],
  },
  {
    title: "Agendamentos",
    to: "/schedules",
    icon: "mdi-calendar-clock-outline",
    visible: true,
    isMenu: true,
    profiles: ["ADMIN"],
  },
  {
    title: "Consultas",
    to: "/queries",
    icon: "mdi-hospital-box-outline",
    visible: true,
    isMenu: true,
    profiles: ["ADMIN", "ADVOGADO", "MEDICO"],
  },
  {
    title: "Pacotes de Serviços",
    to: "/packages",
    icon: "mdi-package-variant-closed",
    visible: true,
    isMenu: true,
    profiles: ["ADMIN"],
  },
  {
    title: "Usuários",
    to: "/users",
    icon: "mdi-account-multiple-check-outline",
    visible: true,
    isMenu: true,
    profiles: ["ADMIN"],
  },
  {
    title: "Perfil",
    to: "/profile",
    icon: "mdi-account-multiple-check-outline",
    visible: true,
    isMenu: false,
    profiles: ["ADMIN", "MEDICO", "ADVOGADO"],
  },
];
