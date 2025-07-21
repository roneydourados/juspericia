<template>
  <DialogForm
    :show="show"
    title="Voucher"
    :width="mobile ? '100%' : '60%'"
    @dialog="handleClose"
  >
    <FormCrud @submit="handleSubmit">
      <v-row dense>
        <v-col cols="12" lg="4">
          <StringInput label="Descrição" v-model="form.description" required />
        </v-col>
        <v-col cols="12" lg="4">
          <StringInput
            label="Nome/Código"
            v-model="form.voucherName"
            required
            is-upper-case
            @blur="voucherExisteInUse($event)"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <v-card flat color="error" v-if="$voucherExists">
            <v-card-text>
              <span>
                Existe um voucher em uso com nome: {{ form.voucherName }}
              </span>
            </v-card-text>
          </v-card>
          <v-card flat color="success" v-else>
            <v-card-text>
              <span> Informe o código -> {{ form.voucherName }} </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="2">
          <CurrencyInput
            label="Desconto"
            v-model="form.discount"
            required
            :disabled="!!form.user"
          />
        </v-col>
        <v-col cols="12" lg="3">
          <DateTimePicker
            label="Expira em"
            v-model="form.expirationDate"
            required
          />
          <strong v-if="$dueDays > 0" class="ml-2">
            Válido por {{ $dueDays }} Dias
          </strong>
        </v-col>
        <v-col cols="12" lg="2">
          <IntegerInput
            label="Quantidade de usos"
            v-model="form.useQuantity"
            required
            :min="1"
            :disabled="!!form.user"
          />
        </v-col>
        <v-col cols="12" lg="5">
          <SelectSearchLawyer
            label="Cliente"
            v-model="form.user"
            @update:model-value="getSaltCredit"
            clearable
          />
        </v-col>

        <v-col cols="12" lg="4">
          <v-radio-group
            label="Tipo desconto"
            v-model="form.discountType"
            inline
            :disabled="!!form.user"
          >
            <v-radio label="% Porcentagem" value="percentage"></v-radio>
            <v-radio label="R$ Valor" value="value"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" lg="8">
          <v-checkbox
            class="mt-5"
            v-model="form.voucherUsePersonalizedSale"
            label="Liberar para vendas sob demanda e pagamento de solicitação avulsa ?"
          />
        </v-col>
      </v-row>
      <v-divider class="mb-4" />
      <v-row dense class="mb-6">
        <v-col cols="12">
          <div v-if="!form.user" style="height: 15rem">
            <div class="text-subtitle-1 font-weight-bold">
              Pacotes adicionados ao voucher:
            </div>
            <v-list height="100%">
              <v-list-item v-for="pkgv in form.packages" :key="pkgv.id">
                <v-list-item-title>
                  {{ pkgv.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex flex-column">
                    <strong>Valor: {{ pkgv.value }}</strong>
                    <span>
                      {{ pkgv.description }}
                    </span>
                  </div>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-checkbox v-model="pkgv.isChecked" />
                </template>
              </v-list-item>
            </v-list>
          </div>
          <Tabs v-else v-model="tab" :tabs="tabs">
            <template #content>
              <div v-if="tab === 1" style="height: 15rem">
                <div class="text-subtitle-1 font-weight-bold">
                  Pacotes adicionados ao voucher:
                </div>
                <v-list height="100%">
                  <v-list-item v-for="pkgv in form.packages" :key="pkgv.id">
                    <v-list-item-title>
                      {{ pkgv.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex flex-column">
                        <strong>Valor: {{ pkgv.value }}</strong>
                        <span>
                          {{ pkgv.description }}
                        </span>
                      </div>
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-checkbox v-model="pkgv.isChecked" />
                    </template>
                  </v-list-item>
                </v-list>
              </div>
              <div v-if="tab === 2" style="height: 15rem">
                total: {{ $totalSalts }}
                <Table
                  title="Saldo de créditos"
                  :headers="headers"
                  :items="$salts"
                  :show-crud="false"
                  show-select
                  v-model="selectedCredits"
                  @update:model-value="setDiscountForSalt"
                >
                  <template #top-table>
                    <div class="d-flex justify-center mb-2">
                      <strong class="text-error text-center">
                        TODOS OS SALDOS DE CRÉDITOS AQUI SELECIONADOS SERÃO
                        ZERADOS AO SALVAR O VOUCHER, ESTA AÇÃO É
                        IRREVERSÍVEL!</strong
                      >
                    </div>
                  </template>
                  <template #item.status="{ item }">
                    <v-chip label :color="getStatusName(item).color">
                      <v-icon
                        :color="getStatusName(item).color"
                        :icon="getStatusName(item).icon"
                        size="20"
                        start
                      />
                      {{ getStatusName(item).text }}
                    </v-chip>
                  </template>
                  <template #item.dateCreated="{ item }">
                    <strong>
                      {{ dayjs(item.dateCreated).format("DD/MM/YYYY") }}
                    </strong>
                  </template>
                  <template #item.value="{ item }">
                    <strong>{{ amountFormated(item.value, true) }}</strong>
                  </template>
                  <template #item.salt="{ item }">
                    <strong>{{ amountFormated(item.salt, true) }}</strong>
                  </template>
                  <template #item.solicitationConsultationValue="{ item }">
                    <strong>{{
                      amountFormated(item.solicitationConsultationValue, true)
                    }}</strong>
                  </template>

                  <template #item.expireDate="{ item }">
                    <strong>
                      {{ dayjs(item.expireDate).format("DD/MM/YYYY") }}
                    </strong>
                  </template>
                  <template #item.createdAt="{ item }">
                    <strong>{{
                      dayjs(item.createdAt).format("DD/MM/YYYY")
                    }}</strong>
                  </template>
                </Table>
              </div>
            </template>
          </Tabs>
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
    type: Object as () => VoucherFormProps,
    default: () => ({}),
  },
});

const { mobile } = useDisplay();
const { amountFormated } = useUtils();
const consultationPackageStore = useServicePackageStore();
const saltCredit = useUserCreditSaltStore();
const vouchers = useVoucherStore();
const sistemParametersStore = useSystemParametersStore();
const show = defineModel({ default: false });
const loading = ref(false);
const selectedCredits = ref<UserCreditSalt[]>([]);
const tab = ref(1);
const form = ref({
  voucherName: "",
  description: "",
  discount: "",
  discountType: "percentage",
  expirationDate: "",
  packages: [] as VoucherItemsProps[],
  useQuantity: "1",
  voucherUsePersonalizedSale: false,
  user: undefined as UserProps | undefined,
});
const headers = ref([
  {
    title: "Status",
    align: "start",
    sortable: false,
    key: "status",
  },
  { title: "Data da compra", key: "dateCreated" },
  { title: "Data de expiração", key: "expireDate" },
  { title: "Valor", key: "value" },
  { title: "Saldo", key: "salt" },
  {
    title: "Valor descontar por solicitação",
    key: "solicitationConsultationValue",
  },
  { title: "Marcar", key: "actions" },
]);

const tabs = computed(() => {
  return [
    {
      title: "Pacotes",
      icon: "mdi-package-variant",
    },
    {
      title: "Saldo de créditos",
      icon: "mdi-cash-multiple",
    },
  ];
});

const $systemParameters = computed(() => {
  return sistemParametersStore.$parameters;
});

const $packages = computed(() => {
  if (
    !consultationPackageStore.$all ||
    consultationPackageStore.$all.length === 0
  ) {
    return [];
  }

  if (
    props.data &&
    props.data.voucherItems &&
    props.data.voucherItems.length > 0
  ) {
    const voucherItemsFiltered = props.data.voucherItems.filter(
      (item) => item.servicePackage
    );

    return consultationPackageStore.$all.filter(
      (pkg) =>
        !voucherItemsFiltered.some((p) => p.servicePackage!.id === pkg.id)
    );
  }

  return consultationPackageStore.$all.map((pkg) => ({
    ...pkg,
    isChecked: false,
    itemType: "service-package",
  }));
});

const $voucherExists = computed(() => vouchers.$voucherExists);
const $salts = computed(() => {
  return saltCredit.$credits?.credits
    ? saltCredit.$credits.credits.map((credit) => ({
        ...credit,
        isChecked: false,
      }))
    : [];
});

const $totalSalts = computed(() => {
  return selectedCredits.value.reduce((total, credit) => {
    return total + Number(credit.salt ?? 0);
  }, 0);
});

const $dueDays = computed(() => {
  return dayjs(form.value.expirationDate).diff(dayjs(), "day");
});

const loadForm = () => {
  form.value = {
    voucherName: props.data.voucherName || "",
    description: props.data.description || "",
    discount: props.data.discount || "",
    discountType: props.data.discountType || "percentage",
    expirationDate: props.data.expirationDate || "",
    useQuantity: props.data.useQuantity.toString() || "1",
    voucherUsePersonalizedSale: props.data.voucherUsePersonalizedSale ?? false,
    user: props.data.user || undefined,
    packages: props.data.voucherItems
      ? [
          ...props.data.voucherItems
            .map((item) => {
              if (item.itemType === "service-package") {
                return {
                  ...item.servicePackage,
                  isChecked: true,
                  itemType: "service-package",
                };
              }
              // If not service-package, return undefined
              return undefined;
            })
            .filter((pkg) => pkg !== undefined),
          ...$packages.value.map((pkg) => ({
            ...pkg,
            isChecked: false,
            itemType: "service-package",
          })),
        ]
      : $packages.value.map((pkg) => ({
          ...pkg,
          isChecked: false,
          itemType: "service-package",
        })),
  };
};

watch(
  () => show.value,
  (newValue) => {
    if (newValue && !props.data.id) {
      form.value.packages = $packages.value.map((pkg) => ({
        ...pkg,
        isChecked: false,
        itemType: "service-package",
      }));
    } else if (newValue && props.data.id) {
      loadForm();
    }
  },
  { immediate: true }
);

const validations = () => {
  //validação do desconto máximo
  if (form.value.discountType === "percentage") {
    if (
      Number(form.value.discount ?? "0") >
      Number($systemParameters.value?.voucherMaxDiscountPercentage ?? 0)
    ) {
      push.warning(
        `O desconto máximo permitido em é de ${Number(
          $systemParameters.value?.voucherMaxDiscountPercentage ?? 0
        )}%`
      );

      return false;
    }
  } else if (form.value.discountType === "value") {
    if (
      Number(form.value.discount ?? "0") >
      Number($systemParameters.value?.voucherMaxDiscountValue ?? 0)
    ) {
      push.warning(
        `O desconto máximo permitido em valor é de ${Number(
          $systemParameters.value?.voucherMaxDiscountValue ?? 0
        )} R$`
      );

      return false;
    }
  }

  // validação da quantidade de usos
  if (
    Number(form.value.useQuantity ?? "1") >
    Number($systemParameters.value?.voucherMaxQuantityUse ?? 0)
  ) {
    push.warning(
      `A quantidade máxima de usos não deve ultrapassar ${Number(
        $systemParameters.value?.voucherMaxQuantityUse ?? 0
      )}`
    );
    return false;
  }

  // validação da data de expiração
  const dueDays = dayjs(form.value.expirationDate).diff(dayjs(), "day");

  if (dueDays > Number($systemParameters.value?.voucherMaxQuantityDays ?? 0)) {
    push.warning(
      `A data de expiração não deve ultrapassar ${Number(
        $systemParameters.value?.voucherMaxQuantityDays ?? 0
      )} dias a partir de hoje`
    );
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (!validations()) return;

    if (props.data.publicId) {
      await update();
    } else {
      await create();
    }

    const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");
    await vouchers.index({ initialDate, finalDate }); // Refresh the voucher list

    show.value = false; // Close the dialog after submission
    clearForm();
  } catch (error) {
    console.error("Error creating voucher:", error);
  } finally {
    loading.value = false;
  }
  // Handle form submission logic here
};

const handleClose = () => {
  show.value = false;
  clearForm();
};

const clearForm = () => {
  form.value = {
    voucherName: "",
    description: "",
    discount: "",
    discountType: "percentage",
    expirationDate: "",
    packages: [],
    useQuantity: "1",
    voucherUsePersonalizedSale: false,
    user: undefined,
  };
  vouchers.clear();
  selectedCredits.value = [];
};

const create = async () => {
  if ($voucherExists.value) {
    return;
  }

  try {
    const voucherItems = form.value.packages.filter((pkg) => pkg.isChecked);

    // se possuir saldo em créditos selecionados, adicionar ao voucherItems
    if (selectedCredits.value.length > 0) {
      selectedCredits.value.forEach((credit) => {
        voucherItems.push({
          itemType: "user-credit",
          id: credit.id,
        });
      });
    }

    await vouchers.create({
      ...form.value,
      userId: form.value.user ? Number(form.value.user.id) : undefined,
      publicId: props.data.publicId,
      voucherItems,
    });
  } catch (error) {
    console.error("Error creating voucher:", error);
  }
};

const voucherExisteInUse = async (voucherName: string) => {
  await vouchers.existsInUse(voucherName);
};

const update = async () => {
  try {
    const voucherItems = form.value.packages.filter((pkg) => pkg.isChecked);

    // se possuir saldo em créditos selecionados, adicionar ao voucherItems
    if (selectedCredits.value.length > 0) {
      selectedCredits.value.forEach((credit) => {
        voucherItems.push({
          itemType: "user-credit",
          id: credit.id,
        });
      });
    }

    await vouchers.update({
      ...form.value,
      userId: form.value.user ? Number(form.value.user.id) : undefined,
      publicId: props.data.publicId,
      voucherItems,
    });
  } catch (error) {
    console.error("Error updating voucher:", error);
  }
};

const getSaltCredit = async () => {
  if (!form.value.user || !form.value.user.id) {
    selectedCredits.value = [];
    return;
  }

  form.value.discountType = "value";
  form.value.useQuantity = "1";
  form.value.discount = "";

  try {
    const initialDate = dayjs().startOf("year").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("year").format("YYYY-MM-DD");
    await saltCredit.index({
      initialDate,
      finalDate,
      userId: form.value.user.id,
      isSalt: true,
      status: "CONFIRMED",
    });
  } catch (error) {
    console.error("Error fetching salt credit:", error);
  }
};

const getStatusName = (item: UserCreditSalt) => {
  const currentDate = dayjs();

  switch (item.status) {
    case "CONFIRMED":
      // se estiver ativo, então verificar se não expirou
      return {
        text: dayjs(item.expireDate).isBefore(currentDate)
          ? "Expirado"
          : "Disponível",
        color: dayjs(item.expireDate).isBefore(currentDate)
          ? "warning"
          : "success",
        icon: "mdi-check-circle-outline",
      };
    case "PENDING":
      return {
        text: "Pendente",
        color: "warning",
        icon: "mdi-circle-outline",
      };
    case "REFUNDED":
      return {
        text: "Cancelado",
        color: "error",
        icon: "mdi-cancel",
      };
    default:
      return {
        text: "Indefinido",
        color: "grey",
        icon: "mdi-circle-outline",
      };
  }
};

const setDiscountForSalt = () => {
  form.value.discount = amountFormated($totalSalts.value ?? 0, false);
};
</script>
