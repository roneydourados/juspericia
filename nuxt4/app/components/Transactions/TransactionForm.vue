<template>
  <DialogForm
    title="Nova transação"
    :show="show"
    @dialog="handleCancel"
    :width="mobile ? '100%' : '40%'"
    borderColor="#c8e040"
  >
    <FormCrud :on-submit="handleConfirm">
      <v-row dense class="mt-">
        <v-col cols="12">
          <StringInput
            label="Descrição"
            v-model="model.description"
            required
            :readonly="!!model.servicePackage"
          />
        </v-col>
        <v-col
          cols="12"
          :lg="
            $currentUser?.profile?.type === 'GERENTE' ||
            $currentUser?.profile?.type === 'ADMIN'
              ? '6'
              : '12'
          "
        >
          <SelectSearchLawyer
            label="Cliente"
            v-model="model.client"
            required
            clearable
          />
        </v-col>
        <v-col
          v-if="
            $currentUser?.profile?.type === 'GERENTE' ||
            $currentUser?.profile?.type === 'ADMIN'
          "
          cols="12"
          lg="6"
        >
          <SelectSearchSeller
            v-model="model.seller"
            clearable
            :required="
              $currentUser?.profile?.type === 'GERENTE' ||
              $currentUser?.profile?.type === 'ADMIN'
            "
          />
        </v-col>
        <v-col cols="12">
          <SelectSearchServicePackage
            v-model="model.servicePackage"
            @update:model-value="handlePackageValues"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="4">
          <CurrencyInput
            label="Valor"
            v-model="model.itemValue"
            required
            :readonly="!!model.servicePackage"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <IntegerInput
            label="Quantidade de pacotes"
            v-model="model.packageQuantity"
            required
            :readonly="!!model.servicePackage"
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
        <v-col cols="12" lg="6" class="mt-4">
          <span>Valor médio por pacote:</span>
          <strong class="ml-2">{{ $packgeValueMedia }}</strong>
        </v-col>
        <v-col
          v-if="
            $currentUser?.profile?.type === 'GERENTE' ||
            $currentUser?.profile?.type === 'ADMIN'
          "
          cols="12"
          lg="6"
        >
          <v-switch
            color="success"
            label="Lançar venda confirmada"
            v-model="model.saleConfirmed"
          />
        </v-col>
        <v-col v-if="model.saleConfirmed" cols="12">
          <strong class="text-danger">
            Antes de lançar uma venda confirmada, confira no sistema de
            pagamento se o mesmo foi devidamente realizado!
          </strong>
        </v-col>
      </v-row>
    </FormCrud>
    <!-- <FormDebug v-model="model.itemValue" /> -->
    <DialogLoading :dialog="loading" />
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
import { uuidv7 } from "uuidv7";

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
  seller: undefined as UserProps | undefined,
  dueDays: 10,
  itemValue: undefined as string | undefined,
  servicePackage: undefined as ServicePackagesProps | undefined,
  saleConfirmed: false,
});

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
      status: model.value.saleConfirmed ? "CONFIRMED" : "PENDING",
      userId: model.value.client!.id!, // aqui vem quem esta comprando o pacote
      value: Number(model.value.itemValue ?? "0"),
      category: "package",
      billingType: "none",
      sellerId: model.value.seller
        ? model.value.seller.id
        : $currentUser.value!.id!,
      packgeQuantity: Number(model.value.packageQuantity),
      packgeSaleValue: Number(model.value.itemValue ?? "0"),
      expiredAt: dayjs().add(30, "day").format("YYYY-MM-DD"),
      saleType: "manual",
      packageId: model.value.servicePackage
        ? model.value.servicePackage.id
        : undefined,
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
    seller: undefined,
    servicePackage: undefined,
    saleConfirmed: false,
  };
};

const handlePackageValues = () => {
  if (model.value.servicePackage) {
    model.value.description =
      model.value.servicePackage.name ?? "Venda de pacote sob medida";
    model.value.itemValue = model.value.servicePackage.value?.toString();
    model.value.packageQuantity =
      model.value.servicePackage.packageQuantity?.toString() ?? "1";
  } else {
    model.value.description = "Venda de pacote sob medida";
    model.value.itemValue = "";
    model.value.packageQuantity = "1";
  }
};
</script>
