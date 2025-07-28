import VueApexCharts from "vue3-apexcharts";

export default defineNuxtPlugin((app) => {
  // @ts-ignore
  app.vueApp.use(VueApexCharts);
});
