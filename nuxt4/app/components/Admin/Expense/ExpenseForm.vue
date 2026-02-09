<template>
  <DialogForm
    :show="show"
    title="Despesa"
    width="600"
    border-color="#c8e040"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="handleSubmit">
      <v-row dense>
        <v-col cols="12" lg="6">
          <DatePicker
            v-model="data.emissionDate"
            label="Data de emissao"
            required
          />
        </v-col>
        <v-col cols="12" lg="6">
          <DatePicker
            v-model="data.dueDate"
            label="Data de vencimento"
            required
          />
        </v-col>
        <v-col cols="12">
          <TextInput
            v-model="data.description"
            label="Descricao"
            required
            icon="mdi-text-box-outline"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <CurrencyInput
            v-model="data.value"
            label="Valor"
            required
            icon="mdi-currency-brl"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <SelectInput
            v-model="data.status"
            label="Status"
            item-title="name"
            item-value="type"
            :items="statusItems"
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
type ExpenseFormModel = {
  emissionDate: string;
  dueDate: string;
  description: string;
  value: string;
  status: string;
};

const show = defineModel<boolean>("show", { default: false });
const data = defineModel<ExpenseFormModel>("data", {
  default: () => ({
    emissionDate: "",
    dueDate: "",
    description: "",
    value: "",
    status: "open",
  }),
});

const emit = defineEmits(["submit", "close"]);

const statusItems = [
  { name: "Aberto", type: "open" },
  { name: "Pago", type: "paid" },
];

const handleSubmit = async () => {
  emit("submit");
};

const handleClose = () => {
  show.value = false;
  emit("close");
};
</script>
