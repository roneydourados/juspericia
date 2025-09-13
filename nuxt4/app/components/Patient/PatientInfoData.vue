<template>
  <v-container fluid>
    <v-row dense class="text-primary">
      <v-col cols="12" lg="3">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          title="Nome"
          :content="`${$single?.name} ${$single?.surname}`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          title="Nome da mãe"
          :content="`${$single?.motherName ?? 'Não informado!'}`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          title="Whatsapp"
          :content="`${
            $single?.phone
              ? formatTelephoneNumber($single?.phone)
              : 'Não informado!'
          }`"
          :show-divider="false"
        />
      </v-col>

      <v-col cols="12" lg="3">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          title="Data de nascimento"
          :content="`${
            $single?.birthDate
              ? dayjs($single?.birthDate).format('DD/MM/YYYY')
              : 'Não informado!'
          }`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          font-size="0.9"
          font-size-content="0.9"
          title="Sexo"
          :content="`${$single?.sexy === 'M' ? 'Masculino' : 'Feminino'}`"
          :show-divider="false"
        />
      </v-col>
    </v-row>
    <v-row dense class="text-primary">
      <v-col cols="12" lg="3">
        <InfoLabel
          title="CPF"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${
            $single?.cpf ? formatCPFOrCNPJ($single?.cpf) : 'Não informado!'
          }`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="RG"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${$single?.rg ?? 'Não informado!'}`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Advogado responsável"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${$single?.User?.name ?? 'Não informado!'}`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="E-mail Advogado responsável"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${$single?.User?.email ?? 'Não informado!'}`"
          :show-divider="false"
        />
      </v-col>
    </v-row>
    <v-row dense class="mb-4 mt-4">
      <v-col cols="12">
        <strong style="font-size: 1rem">Dados endereço</strong>
      </v-col>
    </v-row>
    <v-row dense class="text-primary">
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Cep"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${
            $single?.PatientAddress?.addressZipcode
              ? formatCEP($single?.PatientAddress?.addressZipcode)
              : '00000-000'
          }`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Rua"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${
            $single?.PatientAddress?.addressStreet ?? 'Não informado!'
          } Nº: ${$single?.PatientAddress?.addressNumber ?? 'S/N'}`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Bairro"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${
            $single?.PatientAddress?.addressDistrict ?? 'Não informado!'
          }`"
          :show-divider="false"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <InfoLabel
          title="Cidade/UF"
          font-size="0.9"
          font-size-content="0.9"
          :content="`${
            $single?.PatientAddress?.addressCity ?? 'Não informado!'
          }/${$single?.PatientAddress?.addressState ?? 'NT'}`"
          :show-divider="false"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- <pre>{{ $single }}</pre> -->
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { formatCEP } from "@brazilian-utils/brazilian-utils";

const patientStore = usePatientStore();

const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();

const $single = computed(() => patientStore.$single);
</script>
