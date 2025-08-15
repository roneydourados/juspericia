<template>
  <v-card class="card-saldo" rounded="xl" elevation="8" width="100%">
    <div class="barra-lateral" :style="`background: ${color}`" />
    <div class="conteudo">
      <div class="linha-superior">
        <span class="titulo">{{ title }}</span>
        <v-icon color="#2b4d9a" size="24">mdi-calendar-month</v-icon>
      </div>
      <div class="mt-4 text-primary font-weight-bold" style="font-size: 1.5rem">
        {{ amountFormated(value, true) }}
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  value: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: "",
  },
});

const { amountFormated } = useUtils();
</script>

<style scoped>
.card-saldo {
  width: 270px;
  height: 105px;
  display: flex;
  overflow: hidden;
}

.barra-lateral {
  width: 12px;
  /*
  background: linear-gradient(
    to bottom,
    #c8e040,
    #c8e040
  );  pode ajustar para mais degradê */
  flex-shrink: 0;
}

.conteudo {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 16px;
}

.linha-superior {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titulo {
  font-size: 14px;
  color: #2b4d9a;
  font-weight: 500;
  text-transform: capitalize;
}

.valor {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #2b4d9a;
}
</style>
