<template>
  <v-container fluid>
    <v-row dense class="mb-4">
      <v-col cols="12">
        <strong style="font-size: 1rem">Dados cadastrais</strong>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="3">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          icon="mdi-account-badge-outline"
          color-icon="blue"
          title="Nome"
          :content="`${$single?.name} ${$single?.surname}`"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          icon="mdi-account-badge-outline"
          color-icon="blue"
          title="Nome da mãe"
          :content="`${$single?.motherName ?? 'Não informado!'}`"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          title="Whatsapp"
          icon="mdi-whatsapp"
          color-icon="green"
          :content="`${
            $single?.phone
              ? formatTelephoneNumber($single?.phone)
              : 'Não informado!'
          }`"
          :show-divider="true"
        />
      </v-col>

      <v-col cols="12" lg="2">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          title="Data de nascimento"
          icon="mdi-calendar-multiple-check"
          color-icon="warning"
          :content="`${
            $single?.birthDate
              ? moment($single?.birthDate).format('DD/MM/YYYY')
              : 'Não informado!'
          }`"
          :show-divider="true"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          title="Sexo"
          icon="mdi-account-multiple-outline"
          color-icon="blue"
          :content="`${$single?.sexy === 'M' ? 'Masculino' : 'Feminino'}`"
          :show-divider="true"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="CPF"
          icon="mdi-clipboard-account-outline"
          color-icon="info"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${
            $single?.cpf ? formatCPFOrCNPJ($single?.cpf) : 'Não informado!'
          }`"
          :show-divider="true"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="RG"
          icon="mdi-clipboard-account-outline"
          color-icon="info"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${$single?.rg ?? 'Não informado!'}`"
          :show-divider="true"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Advogado responsável"
          icon="mdi-account-tie-outline"
          color-icon="info"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${$single?.User?.name ?? 'Não informado!'}`"
          :show-divider="true"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="E-mail Advogado responsável"
          icon="mdi-email-outline"
          color-icon="warning"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${$single?.User?.email ?? 'Não informado!'}`"
          :show-divider="true"
        />
      </v-col>
    </v-row>
    <v-row dense class="mb-4 mt-4">
      <v-col cols="12">
        <strong style="font-size: 1rem">Dados endereço</strong>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="1">
        <InfoLabel
          title="Cep"
          icon="mdi-map-marker-radius-outline"
          color-icon="info"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${
            $single?.Address?.addressZipcode
              ? formatCEP($single?.Address?.addressZipcode)
              : '00000-000'
          }`"
          :show-divider="true"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Rua"
          icon="mdi-map-marker-outline"
          color-icon="info"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${
            $single?.Address?.addressStreet ?? 'Não informado!'
          } Nº: ${$single?.Address?.addressNumber ?? 'S/N'}`"
          :show-divider="true"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Bairro"
          icon="mdi-map-marker-outline"
          color-icon="info"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${$single?.Address?.addressDistrict ?? 'Não informado!'}`"
          :show-divider="true"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Cidade/UF"
          icon="mdi-map-marker-outline"
          color-icon="info"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${$single?.Address?.addressCity ?? 'Não informado!'}/${
            $single?.Address?.addressState ?? 'NT'
          }`"
          :show-divider="true"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- <pre>{{ $single }}</pre> -->
</template>

<script setup lang="ts">
import moment from "moment";
import { formatCEP } from "@brazilian-utils/brazilian-utils";

const patientStore = usePatientStore();

const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();

const $single = computed(() => patientStore.$single);
</script>
