<template>
  <DialogForm
    title="Nova transação"
    :show="show"
    @dialog="handleCancel"
    :width="mobile ? '100%' : '40%'"
  >
    <FormCrud :on-submit="handleConfirm">
      <v-row dense class="mt-">
        <v-col cols="12">
          <StringInput label="Descrição" v-model="model.description" required />
        </v-col>
        <v-col cols="12">
          <SelectSearchLawyer label="Cliente" v-model="model.client" required />
        </v-col>
        <v-col cols="12" lg="4">
          <CurrencyInput label="Valor" v-model="model.itemValue" required />
        </v-col>
        <v-col cols="12" lg="4">
          <IntegerInput
            label="Quantidade de pacotes"
            v-model="model.packageQuantity"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <SelectInput
            label="Valido para pagamento por"
            v-model="model.dueDays"
            item-title="title"
            item-value="value"
            :items="[
              {
                title: '10 dias',
                value: 10,
              },
              {
                title: '15 dias',
                value: 15,
              },
              {
                title: '20 dias',
                value: 20,
              },
            ]"
            required
          />
        </v-col>
        <v-col cols="12" class="mt-n5 mb-4">
          <span>Valor médio por pacote:</span>
          <strong class="ml-2">{{ $packgeValueMedia }}</strong>
        </v-col>
      </v-row>
    </FormCrud>
    <FormDebug v-model="model" />
    <DialogLoading :dialog="loading" />
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
import { uuidv7 } from "uuidv7";
//import { AssasPreCheckoutProps } from "@/types/assaas/Precheckout";

const { amountFormated } = useUtils();

const auth = useAuthStore();
const saleStore = useSaleStore();
const { mobile } = useDisplay();

const loading = ref(false);
const show = defineModel("show", { default: false });
const emit = defineEmits(["confirm-sale", "cancel"]);

const $currentUser = computed(() => auth.$currentUser);
const $packgeValueMedia = computed(() => {
  let media = 0;

  if (model.value.packageQuantity && model.value.itemValue) {
    media = Number(
      (
        Number(model.value.itemValue) / Number(model.value.packageQuantity ?? 1)
      ).toFixed(2)
    );
  }

  return amountFormated(media, true);
});

const model = ref({
  description: "Venda de pacote sob medida",
  packageQuantity: "1",
  client: undefined as UserProps | undefined,
  dueDays: 10,
  itemValue: undefined as string | undefined,
});

// watch(
//   () => show.value,
//   async (newValue) => {
//     if (newValue) {
//       await systemParametersStore.index();
//     }
//   },
//   { immediate: true }
// );

const handleCancel = () => {
  loading.value = false;
  show.value = false;
  clearModel();
  emit("cancel");
};

const handleConfirm = async () => {
  try {
    await saleStore.create({
      saleId: uuidv7(),
      dueDate: dayjs().add(model.value.dueDays, "day").format("YYYY-MM-DD"),
      dateCreated: dayjs().format("YYYY-MM-DD"),
      description: model.value.description, //resp.data.description,
      status: "PENDING",
      userId: model.value.client!.id!, // aqui vem quem esta comprando o pacote
      value: Number(model.value.itemValue ?? "0"),
      category: "package",
      billingType: "none",
      sellerId: $currentUser.value!.id!,
      packgeQuantity: Number(model.value.packageQuantity),
      packgeSaleValue: Number(model.value.itemValue ?? "0"),
      expiredAt: dayjs().add(30, "day").format("YYYY-MM-DD"),
      saleType: "manual",
    });
    show.value = false;
    clearModel();
    emit("confirm-sale");
  } catch (error) {
    push.error("Erro ao finalizar pagamento");
    console.log("🚀 ~ handleSaleItem ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const clearModel = () => {
  model.value = {
    description: "Venda de pacote sob medida",
    packageQuantity: "1",
    client: undefined,
    dueDays: 10,
    itemValue: undefined,
  };
};
</script>
