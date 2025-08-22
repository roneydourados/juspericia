<template>
  <div class="pa-12">
    <v-row>
      <v-col cols="12" class="pa-6">
        <HeaderPage title="Administração" font-size="1.8rem" />
      </v-col>
      <v-col v-for="(item, index) in itemsMenu" :key="index" cols="12" lg="3">
        <CardBlur @click="handlClick(item.to)" height="100%">
          <template #content>
            <div class="d-flex flex-column">
              <v-avatar size="60" color="colorIcon" class="mb-2 ml-4">
                <v-icon :icon="item.icon" size="32" color="white" />
              </v-avatar>

              <p class="text-subtitle-2 text-darkText px-6">
                {{ item.text }}
              </p>
            </div>
          </template>
        </CardBlur>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const handlClick = async (route: string) => {
  await router.push(route);
};

const itemsMenu = ref([
  {
    to: "/admin/medics",
    icon: "mdi-stethoscope",
    text: "Cadastro de médicos. Cadastrar/Administrar médicos parceiros que serão prestadores de atendimento via telemedicina.",
  },
  {
    to: "/admin/admins",
    icon: "mdi-shield-account",
    text: "Usuários administradores. Gestão dos usuários com acesso total as funcionalidades do sistema.",
  },
  {
    to: "/admin/queries",
    icon: "mdi-file-find-outline",
    text: "Consultas. Cadastro das consultas oferecidas pela plataforma",
  },
  {
    to: "/admin/packages",
    icon: "mdi-package-variant-closed-plus",
    text: "Cadastro de pacote de consultas. Gestão de pacotes de consultas possibilita a venda de consultas em lote e com preço mais acessível ao escritório",
  },
  {
    to: "/admin/report-models",
    icon: "mdi-file-chart-check-outline",
    text: "Modelos de laudo. Deixar modelos de laudo médico pré-cadastrados para serem utilizados como base no lançamento de um laudo final.",
  },
  {
    to: "/admin/parameters",
    icon: "mdi-cog-outline",
    text: "Parametrizações. Configurações gerais do sistema.",
  },
  {
    to: "/admin/comissions",
    icon: "mdi-briefcase-account-outline",
    text: "Gestão de comissões. Controle de comissões dos médicos e vendedores.",
  },
  {
    to: "/admin/medical-specialty",
    icon: "mdi-medical-bag",
    text: "Cadastro de especialidades médicas. Cadastrar/Administrar especialidades médicas.",
  },
]);
</script>
