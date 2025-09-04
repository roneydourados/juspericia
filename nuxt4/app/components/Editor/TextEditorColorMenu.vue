<template>
  <div>
    <v-menu
      v-model="show"
      :close-on-content-click="false"
      location="bottom center"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          variant="tonal"
          size="x-small"
          color="primary"
          icon
          v-bind="props"
        >
          <v-icon icon="mdi-format-color-text" color="deep-orange" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Text Color
          </v-tooltip>
        </v-btn>
      </template>

      <v-card width="250" class="pa-2 px-4" rounded="lg">
        <v-row dense>
          <v-col cols="12">
            <strong>Text color</strong>
          </v-col>

          <v-col
            v-for="color in textColors"
            :key="color.value"
            cols="12"
            lg="2"
          >
            <v-btn
              variant="flat"
              size="31"
              :color="color.value"
              class="d-flex align-center justify-center"
              @click="getColor(color.value)"
            >
              <v-icon icon="mdi-format-color-text" size="18" />
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
//********IMPORTS*********
//Importações: insira aqui as importações de componentes, bibliotecas e etc.
//Ex. import { ref, computed, watch, onMounted } from 'myImports'
//********IMPORTS*********

//********COMPOSABLES*********
//Composables: insira aqui os composables que serão utilizados no componente.
//Ex. import { useStore } from 'useMyComposable'
//********COMPOSABLES*********

//********PROPS*********
//Props: insira aqui as props do componente.
//Ex. defineProps({ title: { type: String, required: true } })
//********PROPS*********

//********EMITS*********
//Emits: insira aqui os emits do componente.
//Ex. const emits = defineEmits(['increment'])
const emits = defineEmits(["update:modelValue"]);

//********EMITS*********

//********EXPOSE*********
//Expose: insira aqui os exposes do componente.
//Ex. defineExpose({ load });
//********EXPOSE*********

//********VARIAVEIS*********
//Variáveis reativas: insira aqui as variáveis reativas do componente.
//Ex. const count = ref(0)
const textColors = [
  { value: "#F44336" },
  { value: "#4CAF50" },
  { value: "#2196F3" },
  { value: "#000000" },
  { value: "#FFA726" },
  { value: "#AB47BC" },
  { value: "#3E2723" },
  { value: "#263238" },
  { value: "#827717" },
  { value: "#004D40" },
  { value: "#311B92" },
  { value: "#009688" },
];
const show = defineModel("show", {
  type: Boolean,
  default: false,
});
const color = defineModel({
  default: "",
});
//********VARIAVEIS*********

//********WATCHS*********
//Watches: insira aqui os watches do componente.
//Ex. watch(count, (newValue, oldValue) => { console.log(newValue, oldValue) })
//********WATCHS*********

//********COMPUTEDS*********
//Computed: insira aqui os computeds do componente.
//Ex. const doubleCount = computed(() => count.value * 2)
//********COMPUTEDS*********

//********LIFECYCLE HOOKS*********
//Ex const onMounted(() => { console.log('mounted') })
//********LIFECYCLE HOOKS*********

//********METHODS*********
//Métodos: insira aqui os métodos do componente.
// EX. const increment = () => { count.value++ }
const getColor = (item: string) => {
  color.value = item;
  show.value = false;
  emits("update:modelValue", color.value);
};
//********METHODS*********

//********OUTROS*********
//Outros
//********OUTROS*********
</script>

<style scoped></style>
