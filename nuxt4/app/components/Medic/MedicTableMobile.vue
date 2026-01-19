<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      :color="`${$currentTheme === 'mainThemeDark' ? '' : 'primary'}`"
      rounded="circle"
      density="comfortable"
      :total-visible="PAGINATION_TOTAL_VISIBLE"
    />
    <span class="text-caption text-colorTextPrimary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>
  <v-row dense>
    <v-col cols="12">
      <StringInput
        v-model="search"
        placeholder="Digite algo para efetuar consulta"
        clearable
        dense
        rounded
        class="w-100"
        @update:model-value="emit('search', search)"
      />
    </v-col>
    <v-col cols="12" lg="2" class="d-flex justify-end mt-n6 mb-4">
      <div class="d-flex align-center" style="gap: 0.5rem">
        <Button
          variant="outlined"
          color="grey"
          class="text-none"
          size="small"
          @click="router.back()"
        >
          <v-icon icon="mdi-arrow-left" color="darkText" />
          <span class="text-darkText text-caption"> Voltar </span>
        </Button>
        <Button
          variant="flat"
          color="primary"
          class="text-none"
          size="small"
          @click="$emit('add')"
        >
          <v-icon icon="mdi-plus" color="colorIcon" />
          <span class="text-white text-caption"> Novo </span>
        </Button>
      </div>
    </v-col>
  </v-row>
  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-colorTextPrimary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
    height="280"
  >
    <template #content>
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-outline" color="colorIcon" start />
            <strong>{{ item.name }} </strong>
          </div>
          <v-btn
            icon
            color="colorIcon"
            variant="text"
            size="small"
            @click="emit('edit', item)"
          >
            <v-icon icon="mdi-information-variant-circle-outline" size="20" />
          </v-btn>
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

        <div class="d-flex flex-wrap" style="gap: 0.5rem">
          <div>Atendimento:</div>
          <div v-if="item.seg" class="font-weight-bold">Seg</div>
          <div v-if="item.ter" class="font-weight-bold">Ter</div>
          <div v-if="item.qua" class="font-weight-bold">Qua</div>
          <div v-if="item.qui" class="font-weight-bold">Qui</div>
          <div v-if="item.sex" class="font-weight-bold">Sex</div>
          <div v-if="item.sab" class="font-weight-bold">Sab</div>
          <div v-if="item.dom" class="font-weight-bold">Dom</div>
          <div>Das: {{ item.medicHourStart }} até {{ item.medicHourEnd }}</div>
        </div>
        <v-divider class="mt-4"></v-divider>
      </div>
    </template>
    <template #actions>
      <div
        class="d-flex align-center justify-end mt-n8 w-100"
        style="gap: 0.5rem"
      >
        <v-btn
          icon
          color="colorIcon"
          variant="text"
          size="small"
          @click="emit('edit', item)"
        >
          <v-icon icon="mdi-pencil-outline" size="20"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Editar
          </v-tooltip>
        </v-btn>
        <v-btn
          icon
          color="red"
          variant="text"
          size="small"
          @click="emit('delete', item)"
        >
          <v-icon icon="mdi-delete-outline" size="20"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Apagar
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
const emit = defineEmits(["edit", "delete", "search", "add", "info"]);
const medicStore = useMedicStore();
const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();
const router = useRouter();
const $all = computed(() => medicStore.$all);
const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

const itemsPerPage = ref(10);
const page = ref(1);
const search = ref("");
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
