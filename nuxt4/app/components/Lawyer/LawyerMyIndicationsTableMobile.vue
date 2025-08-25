<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      color="primary"
      rounded="circle"
      density="comfortable"
    />
    <span class="text-caption text-primary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>
  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-primary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
  >
    <!-- <template #title>
      <pre>{{ item }}</pre>
    </template> -->
    <template #content>
      <div class="d-flex flex-column">
        <div class="d-flex align-center" style="gap: 0.5rem">
          <v-icon icon="mdi-account-outline" color="colorIcon" />
          <strong>{{ item.name }}</strong>
        </div>
        <div class="d-flex align-center" style="gap: 0.5rem">
          <v-icon icon="mdi-email-outline" color="colorIcon" />
          <strong>{{ item.email }}</strong>
        </div>
        <div class="d-flex align-center" style="gap: 0.5rem">
          <v-icon icon="mdi-whatsapp" color="colorIcon" />
          <strong>{{ formatTelephoneNumber(item.whatsapp ?? "") }}</strong>
        </div>
        <div class="d-flex align-center" style="gap: 0.5rem">
          <span>Pontos:</span>
          <strong>{{ item.points }}</strong>

          <span>Expira:</span>
          <strong>{{ dayjs(item.expiredAt).format("DD/MM/YYYY") }}</strong>
        </div>
      </div>
    </template>
    <template #actions>
      <div class="d-flex align-center justify-end w-100" style="gap: 0.5rem">
        <v-btn
          icon
          variant="text"
          color="colorIcon"
          size="small"
          @click="$emit('edit', item)"
        >
          <v-icon icon="mdi-pencil-outline" />
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="red"
          size="small"
          @click="$emit('delete', item)"
        >
          <v-icon icon="mdi-delete-outline" />
        </v-btn>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const emit = defineEmits(["edit", "delete"]);
const indicationStore = useUserIndicationStore();
const { formatTelephoneNumber } = useUtils();
const $all = computed(() => indicationStore.$all);

const itemsPerPage = ref(2);
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
