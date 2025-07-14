<template>
  <DialogForm
    :show="show"
    title="Voucher"
    :width="mobile ? '100%' : '60%'"
    @dialog="handleClose"
  >
    <FormCrud @submit="handleSubmit">
      <v-row>
        <v-col cols="12" lg="8">
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
        <v-col cols="12" lg="2">
          <CurrencyInput label="Desconto" v-model="form.discount" required />
        </v-col>
        <v-col cols="12" lg="3">
          <DateTimePicker
            label="Expira em"
            v-model="form.expirationDate"
            required
          />
        </v-col>
        <v-col cols="12" lg="2">
          <IntegerInput
            label="Quantidade de usos"
            v-model="form.useQuantity"
            required
            :min="1"
          />
        </v-col>
        <v-col cols="12" lg="3">
          <v-card flat color="error" v-if="$voucherExists">
            <v-card-text>
              <span>
                Existe um voucher em uso com nome: {{ form.voucherName }}
              </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4">
          <v-radio-group
            label="Tipo desconto"
            v-model="form.discountType"
            inline
          >
            <v-radio label="% Porcentagem" value="percentage"></v-radio>
            <v-radio label="R$ Valor" value="value"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" lg="8">
          <v-checkbox
            class="mt-5"
            v-model="form.voucherUsePersonalizedSale"
            label="Voucher pode ser usado em vendas sob demanda e pagamento de solicitação avulsa ?"
          />
        </v-col>
      </v-row>
      <v-divider class="mb-4" />
      <v-row dense class="mb-6">
        <v-col cols="12">
          <div style="height: 20rem">
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
const consultationPackageStore = useServicePackageStore();
const vouchers = useVoucherStore();
const show = defineModel({ default: false });
const loading = ref(false);

const form = ref({
  voucherName: "",
  description: "",
  discount: "",
  discountType: "percentage",
  expirationDate: "",
  packages: [] as VoucherItemsProps[],
  useQuantity: "1",
  voucherUsePersonalizedSale: false,
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

const loadForm = () => {
  form.value = {
    voucherName: props.data.voucherName || "",
    description: props.data.description || "",
    discount: props.data.discount || "",
    discountType: props.data.discountType || "percentage",
    expirationDate: props.data.expirationDate || "",
    useQuantity: props.data.useQuantity.toString() || "1",
    voucherUsePersonalizedSale: props.data.voucherUsePersonalizedSale ?? false,
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

const handleSubmit = async () => {
  loading.value = true;
  try {
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
  };
  vouchers.clear();
};

const create = async () => {
  if ($voucherExists.value) {
    return;
  }

  try {
    await vouchers.create({
      ...form.value,
      publicId: props.data.publicId,
      voucherItems: form.value.packages.filter((pkg) => pkg.isChecked),
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
    await vouchers.update({
      ...form.value,
      publicId: props.data.publicId,
      voucherItems: form.value.packages.filter((pkg) => pkg.isChecked),
    });
  } catch (error) {
    console.error("Error updating voucher:", error);
  }
};
</script>
