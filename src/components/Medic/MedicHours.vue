<template>
  <v-container>
    <v-row dense>
      <v-col
        cols="1"
        v-for="(slot, index) in timeSlots"
        :key="index"
        @click="bookSlot(slot)"
        :class="['time-slot', { booked: isBooked(slot) }]"
      >
        {{ slot }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Definindo a data de hoje e o horário inicial e final
const today = new Date().toISOString().split("T")[0];
const startTime = ref("08:00");
const endTime = ref("22:00");

// Lista de horários agendados
const bookedSlots = ref<string[]>([]);

// Computa os horários com intervalo de 15 minutos entre 08:00 e 22:00
const timeSlots = computed(() => {
  const start = new Date(`1970-01-01T${startTime.value}`);
  const end = new Date(`1970-01-01T${endTime.value}`);
  const slots: string[] = [];
  while (start <= end) {
    slots.push(
      start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    start.setMinutes(start.getMinutes() + 15);
  }
  return slots;
});

// Função para agendar ou remover um horário
const bookSlot = (slot: string) => {
  if (isBooked(slot)) {
    // Se o horário já estiver agendado, removê-lo
    bookedSlots.value = bookedSlots.value.filter((s) => s !== slot);
  } else {
    // Caso contrário, adicionar à lista de agendados
    bookedSlots.value.push(slot);
  }
};

// Verifica se o horário já está agendado
const isBooked = (slot: string) => {
  return bookedSlots.value.includes(slot);
};
</script>

<style scoped>
.time-slot {
  padding: 10px;
  margin: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.time-slot:hover {
  background-color: #f0f0f0;
}

.booked {
  background-color: #42a5f5;
  color: white;
  font-weight: bold;
}
</style>
