<template>
  <DialogForm
    :show="show"
    title="Detalhes"
    @dialog="show = false"
    :width="mobile ? '100%' : '80%'"
    border-color="#c8e040"
  >
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

    <v-list lines="two">
      <v-list-item v-for="item in paginatedItems" :key="item.id">
        <v-list-item-title>
          <div class="d-flex flex-column text-colorTextPrimary w-100">
            <div class="d-flex justify-space-between align-center w-100">
              Data:
              <strong>
                {{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm") }}
              </strong>
            </div>
            <div class="d-flex justify-space-between align-center w-100">
              <span>Tipo:</span>
              <strong>{{ item.type === "D" ? "Débito" : "Crédito" }}</strong>
            </div>
            <div class="d-flex justify-space-between align-center w-100">
              <span>Valor:</span>
              <strong>{{
                amountFormated(Number(item.value ?? 0), true)
              }}</strong>
            </div>
          </div>
        </v-list-item-title>
        <v-list-item-subtitle>
          <div class="d-flex flex-column text-colorTextPrimary w-100 mt-2">
            <strong>Histórico:</strong>
            {{ item.history }}
          </div>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

import dayjs from "dayjs";
const show = defineModel({
  default: false,
});

const saltCredit = useUserCreditSaltStore();
const { amountFormated } = useUtils();
const { mobile } = useDisplay();

const $all = computed(() => saltCredit.$userCreditLog);
const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

const itemsPerPage = ref(10);
const page = ref(1);

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
