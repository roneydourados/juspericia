<template>
  <v-row dense>
    <v-col cols="12" lg="3">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handlClick('/admin/medics')"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon" class="mb-2">
            <v-icon icon="mdi-stethoscope" size="32" color="white" />
          </v-avatar>

          <p class="text-subtitle-2 text-darkText text-center">
            Cadastro de médicos. Cadastrar/Administrar médicos parceiros que
            serão prestadores de atendimento via telemedicina.
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handlClick('/admin/admins')"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon" class="mb-2">
            <v-icon icon="mdi-shield-account" size="32" color="white" />
          </v-avatar>

          <p class="text-subtitle-2 text-darkText text-center">
            Usuários administradores. Gestão dos usuários com acesso total as
            funcionalidades do sistema.
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handlClick('/admin/sellers')"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon" class="mb-2">
            <v-icon icon="mdi-account-tie-outline" size="32" color="white" />
          </v-avatar>

          <p class="text-subtitle-2 text-darkText text-center">
            Usuários vendedores. Gestão dos usuários vendedores.
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handlClick('/admin/queries')"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon" class="mb-2">
            <v-icon icon="mdi-file-find-outline" size="32" color="white" />
          </v-avatar>

          <p class="text-subtitle-2 text-darkText text-center">
            Consultas. Cadastro das consultas oferecidas pela plataforma
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handlClick('/admin/packages')"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon" class="mb-2">
            <v-icon
              icon="mdi-package-variant-closed-plus"
              size="32"
              color="white"
            />
          </v-avatar>

          <p class="text-subtitle-2 text-darkText text-center">
            Cadastro de pacote de consultas. Gestão de pacotes de consultas
            possibilita a venda de consultas em lote e com preço mais acessível
            ao escritório.
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handlClick('/admin/report-models')"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon" class="mb-2">
            <v-icon
              icon="mdi-file-chart-check-outline"
              size="32"
              color="white"
            />
          </v-avatar>

          <p class="text-subtitle-2 text-darkText text-center">
            Modelos de laudo. Deixar modelos de laudo médico pré-cadastrados
            para serem utilizados como base no lançamento de um laudo final.
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handlClick('/admin/parameters')"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon" class="mb-2">
            <v-icon icon="mdi-cog-outline" size="32" color="white" />
          </v-avatar>

          <p class="text-subtitle-2 text-darkText text-center">
            Parametrizações. Configurações gerais do sistema.
          </p>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        elevation="12"
        rounded="xl"
        class="pa-4"
        height="100%"
        @click="handlClick('/admin/comissions')"
      >
        <div class="d-flex flex-column align-center">
          <v-avatar size="60" color="colorIcon" class="mb-2">
            <v-icon
              icon="mdi-briefcase-account-outline"
              size="32"
              color="white"
            />
          </v-avatar>

          <p class="text-subtitle-2 text-darkText text-center">
            Gestão de comissões. Controle de comissões dos médicos e vendedores.
          </p>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const router = useRouter();

const handlClick = async (route: string) => {
  await router.push(route);
};
</script>
