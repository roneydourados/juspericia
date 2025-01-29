<template>
  <v-row>
    <v-col cols="12" lg="4">
      <v-autocomplete
        v-model="modelFilters.city"
        density="compact"
        variant="outlined"
        :items="cities"
        label="Cidade"
        return-object
        item-title="nameList"
        item-value="name"
        clearable
      >
        <!-- <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="`${item.raw.name} (${item.raw.uf})`"
          ></v-list-item>
        </template>

        <template v-slot:selection="{ item }">
          <span> {{ item.raw.name }} ({{ item.raw.uf }}) </span>
        </template> -->
      </v-autocomplete>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { getCities } from "@brazilian-utils/brazilian-utils";
import { StateName } from "@brazilian-utils/brazilian-utils/dist/common/states";

const modelFilters = defineModel<DashboardSalesFilterProps>("filters", {
  type: Object as PropType<DashboardSalesFilterProps>,
  default: () => ({}),
});

const ufs = ref(ufRegions);
const cities = ref<CityProps[]>([]);

watch(
  () => modelFilters.value.region,
  (region) => {
    loadCities(region);
  }
);

onMounted(() => {
  loadCities("norte");
});

const loadCities = (region: string) => {
  let id = 1;

  //filtrar os estados de acordo com região
  ufs.value = ufRegions.filter(
    (r) => r.region.toLowerCase() === region.toLowerCase()
  );

  cities.value = [];
  modelFilters.value.city = undefined;

  //filtrar as cidades de acordo com os estados filtrados
  ufs.value.forEach((uf) => {
    const cts = getCities(uf.uf as StateName);

    cts.forEach((city) => {
      const payload = {
        id,
        name: city,
        uf: uf.uf,
        nameList: `${city} (${uf.uf})`,
      };

      cities.value.push(payload);

      id++;
    });
  });
};
</script>
