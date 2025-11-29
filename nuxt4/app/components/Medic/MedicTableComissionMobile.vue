<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      color="primary"
      rounded="circle"
      density="comfortable"
      :total-visible="PAGINATION_TOTAL_VISIBLE"
    />
    <span class="text-caption text-primary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>
  <v-row dense class="mb-4">
    <v-col cols="12">
      <div class="d-flex justify-end">
        <Button
          color="grey"
          variant="outlined"
          size="small"
          class="text-none"
          @click="$emit('update-comission')"
        >
          <v-icon icon="mdi-reload" size="20" start color="colorIcon"></v-icon>
          <span class="text-caption text-primary">
            Atualizar valores comissão
          </span>
        </Button>
      </div>
    </v-col>
  </v-row>
  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-primary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
    height="310"
  >
    <template #content>
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-outline" color="colorIcon" start />
            <strong>{{ item.name }} </strong>
          </div>
        </div>
        <div class="d-flex align-center">
          <v-icon icon="mdi-email-outline" color="colorIcon" start />
          <strong>{{ item.email }}</strong>
        </div>
        <div class="d-flex align-center">
          <v-icon icon="mdi-whatsapp" color="colorIcon" start />
          <strong>
            {{ formatTelephoneNumber(item.phone ?? "") }}
          </strong>
        </div>
        <div class="d-flex align-center">
          <v-icon icon="mdi-medical-bag" color="colorIcon" start />
          <strong>
            {{
              item.medicalSpecialty
                ? item.medicalSpecialty.medicalSpecialty
                : "Não  informado"
            }}
          </strong>
        </div>
        <v-divider class="mt-4"></v-divider>

        <v-row dense class="mt-4">
          <v-col cols="12">
            <CurrencyInput
              v-model="item.comissionValue"
              label="Valor comissão"
            />
          </v-col>
          <v-col cols="12">
            <SelectInput
              v-model="item.comissionType"
              :items="consultationValueTypes"
              label="Tipo comissão"
              :hide-details="true"
              item-title="label"
              item-value="value"
            />
          </v-col>
        </v-row>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
const emit = defineEmits(["update-comission"]);
const medicStore = useMedicStore();
const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();
const router = useRouter();
const $all = computed(() => medicStore.$all);

const itemsPerPage = ref(10);
const page = ref(1);
const search = ref("");
const consultationValueTypes = [
  {
    label: "Valor em R$",
    value: "V",
  },
  {
    label: "% Porcentagem",
    value: "P",
  },
];
const paginatedItems = computed(() => {
  const all = $all.value || [];
  const start = (page.value - 1) * itemsPerPage.value;
  return all.slice(start, start + itemsPerPage.value);
});

const pageCount = computed(() => {
  const all = $all.value || [];

  if (all.length === 0) return all.length;

  return Math.ceil(all.length / itemsPerPage.value);
});
</script>
