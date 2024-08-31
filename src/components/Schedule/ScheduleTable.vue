<template>
  <div>
    <v-row dense>
      <v-col cols="12" lg="8">
        <v-card flat rounded="lg">
          <v-card-title class="d-flex flex-column py-8" style="gap: 0.5rem">
            <span class="text-h5 font-weight-bold"> Horários agendados </span>
            <span class="text-grey-darken-1">{{ formattedDate }}</span>
          </v-card-title>
          <v-cad-text>
            <!-- <div class="d-flex flex-column pa-4" style="gap: 1rem"></div> -->
            <div class="w-100 px-4">
              <v-list density="compact">
                <v-list-subheader>Médicos</v-list-subheader>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  :value="item"
                >
                  <template v-slot:prepend>
                    <v-avatar>
                      <v-img
                        :alt="item.title"
                        :src="item.prependAvatar"
                      ></v-img>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    <span>{{ item.title }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <div class="d-flex flex-column w-100">
                      <span style="font-size: 0.8rem">{{ item.subtitle }}</span>
                      <span style="font-size: 0.8rem">{{ item.date }}</span>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-cad-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-locale-provider locale="pt">
          <v-date-picker
            v-model="model.date"
            :allowed-dates="allowedDates"
            hide-actions
            hide-title
            hide-header
            elevation="4"
            rounded="lg"
          ></v-date-picker>
        </v-locale-provider>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";

const model = reactive({
  date: new Date(),
});

const items = ref([
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
    title: "Dr. Brunch",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().format("DD/MM/YYYY")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
    title: "Dr. Summer",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().format("DD/MM/YYYY")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
    title: "Dra. Jessica",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(4, "day").format("DD/MM/YYYY")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
    title: "Dra Heidi",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(1, "day").format("DD/MM/YYYY")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
    title: "Dra Alice",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(2, "day").format("DD/MM/YYYY")}`,
  },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
    title: "Dr. Brunch",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().format("DD/MM/YYYY")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
    title: "Dr. Summer",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().format("DD/MM/YYYY")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
    title: "Dra. Jessica",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(4, "day").format("DD/MM/YYYY")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
    title: "Dra Heidi",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(1, "day").format("DD/MM/YYYY")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
    title: "Dra Alice",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(2, "day").format("DD/MM/YYYY")}`,
  },
]);

const formattedDate = computed(() => {
  const data = new Date();

  const diaSemana = daysOfWeek[data.getDay()];
  const dia = data.getDate();
  const mes = months[data.getMonth()];
  const ano = data.getFullYear();

  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
});

const allowedDates = (val: Date) => {
  const today = moment().add(-1, "days");
  if (moment(val).isBefore(today)) {
    return false;
  }

  return true;
};
</script>
