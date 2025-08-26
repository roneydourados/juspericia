<template>
  <CardBlur height="100%">
    <Table
      title="Solicitações por tipo de benefício"
      :headers="headers"
      :items="$all"
      :showCrud="false"
    >
      <template v-slot:item.name="{ item }">
        <v-list density="compact">
          <v-list-item>
            <template v-slot:title>
              <v-row>
                <v-col cols="12" lg="9">
                  <span>{{ item.name }}</span>
                </v-col>
                <v-col cols="12" lg="3">
                  <v-progress-linear
                    v-model="item.value"
                    :color="item.color"
                    height="14"
                  />
                </v-col>
              </v-row>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </Table>
  </CardBlur>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();
const $estatistics = computed(() => userLawyer.$estatistics);
const { generateRandomColor } = useUtils();

const $all = computed(() => {
  return $estatistics.value?.laywerSolicitationsBenefitType.map((item) => {
    return {
      name: item.benefitType,
      value: item.quantity,
      color: generateRandomColor(),
    };
  });
});

const headers = [
  {
    title: "",
    key: "name",
  },
  // {
  //   title: "Qtde",
  //   key: "value",
  // },
];
</script>
