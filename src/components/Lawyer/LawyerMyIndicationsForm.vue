<template>
  <DialogForm
    title="Indicação de cliente"
    :show="show"
    @dialog="show = false"
    :width="mobile ? '100%' : '50%'"
  >
    <FormCrud :on-submit="handleSubmit">
      <v-row dense>
        <v-col cols="12" lg="6">
          <StringInput
            v-model="form.name"
            label="Nome"
            placeholder="informe nome"
            icon="mdi-account-outline"
            required
          />
        </v-col>
        <v-col cols="12" lg="6">
          <StringInput
            v-model="form.email"
            label="E-mail"
            placeholder="informe seu e-mail"
            icon="mdi-email-outline"
            type="email"
            required
          />
        </v-col>
        <v-col cols="12" lg="6">
          <TelefoneInput
            v-model="form.whatsapp"
            label="Whatsapp"
            placeholder="(99) 99999-9999"
            icon="mdi-whatsapp"
            required
          />
        </v-col>
      </v-row>
    </FormCrud>
    <DialogLoading :dialog="loading" />
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const props = defineProps({
  data: {
    type: Object as PropType<UserIndicationProps>,
    default: () => {},
  },
});

const { mobile } = useDisplay();

const indicationStore = useUserIndicationStore();

const loading = ref(false);

const show = defineModel({
  default: false,
});

const form = ref({
  name: "",
  email: "",
  whatsapp: "",
  status: "PENDING",
});

watch(
  () => show.value,
  (value) => {
    if (value && props.data) {
      loadModel();
    } else {
      clearModel();
    }
  }
);

const loadModel = () => {
  form.value = {
    name: props.data.name ?? "",
    email: props.data.email ?? "",
    whatsapp: props.data.whatsapp ?? "",
    status: props.data.status ?? "PENDING",
  };
};

const clearModel = () => {
  form.value = {
    name: "",
    email: "",
    whatsapp: "",
    status: "PENDING",
  };
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (props.data) {
      await update();
    } else {
      await create();
    }

    const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

    await indicationStore.index({ initialDate, finalDate });
  } catch (error) {
  } finally {
    show.value = false;
    loading.value = false;
  }
};

const create = async () => {
  const expiredAt = dayjs().add(1, "month").format("YYYY-MM-DD");

  await indicationStore.create({
    email: form.value.email,
    name: form.value.name,
    whatsapp: form.value.whatsapp,
    status: "PENDING",
    points: 10,
    expiredAt,
  });
};

const update = async () => {
  await indicationStore.update({
    email: form.value.email,
    name: form.value.name,
    whatsapp: form.value.whatsapp,
    //status: "PENDING",
    //points: 10,
  });
};
</script>
