<template>
  <v-row dense>
    <v-col cols="12" lg="3">
      <v-card
        flat
        rounded="lg"
        min-height="200"
        @click="handlClick('/admin/medics')"
        elevation="8"
      >
        <v-card-title class="d-flex justify-center py-4">
          <AdminMenuStethoscopeSVG height="50" color="#2196F3" />
        </v-card-title>
        <v-card-text class="text-center">
          Cadastro de médicos. Cadastrar/Administrar médicos parceiros que serão
          prestadores de atendimento via telemedicina.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        flat
        rounded="lg"
        min-height="200"
        @click="handlClick('/admin/admins')"
        elevation="8"
      >
        <v-card-title class="d-flex justify-center py-4">
          <AdminMenuAdminsSVG height="50" color="#2196F3" />
        </v-card-title>
        <v-card-text class="text-center">
          Usuários administradores. Gestão dos usuários com acesso total as
          funcionalidades do sistema.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        flat
        rounded="lg"
        min-height="200"
        @click="handlClick('/admin/queries')"
        elevation="8"
      >
        <v-card-title class="d-flex justify-center py-4">
          <AdminMenuQuerieSVG height="50" color="#3F51B5" />
        </v-card-title>
        <v-card-text class="text-center">
          Consultas. Cadastro das consultas oferecidas pela plataforma
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        flat
        rounded="lg"
        min-height="200"
        @click="handlClick('/admin/packages')"
        elevation="8"
      >
        <v-card-title class="d-flex justify-center py-4">
          <AdminMenuServicePackageSVG height="50" color="#FB8C00" />
        </v-card-title>
        <v-card-text class="text-center">
          Cadastro de pacote de consultas. Gestão de pacotes de consultas
          possibilita a venda de consultas em lote e com preço mais acessível ao
          escritório.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        flat
        rounded="lg"
        min-height="200"
        @click="handlClick('/admin/report-models')"
        elevation="8"
      >
        <v-card-title class="d-flex justify-center py-4">
          <AdminMenuReportModelSVG height="50" color="#9C27B0" />
        </v-card-title>
        <v-card-text class="text-center">
          Modelos de laudo. Deixar modelos de laudo médico pré-cadastrados para
          serem utilizados como base no lançamento de um laudo final.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        flat
        rounded="lg"
        min-height="200"
        @click="handlClick('/admin/report-sales')"
        elevation="8"
      >
        <v-card-title class="d-flex justify-center py-4">
          <AdminMenuReportSalesSVG height="50" color="#3F51B5" />
        </v-card-title>
        <v-card-text class="text-center">
          Relatório de vendas. Relatório de resultado e acompanhamento de vendas
          realizadas dentro de um período
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card
        flat
        rounded="lg"
        min-height="200"
        @click="handlClick('/admin/parameters')"
        elevation="8"
      >
        <v-card-title class="d-flex justify-center py-4">
          <v-icon icon="mdi-cog-outline" color="#3F51B5" size="60" />
        </v-card-title>
        <v-card-text class="text-center">
          Parametrizações. Configurações gerais do sistema.
        </v-card-text>
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
