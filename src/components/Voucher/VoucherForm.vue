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
          <StringInput label="Nome" v-model="form.voucherName" required />
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
        <v-col cols="12">
          <v-radio-group
            label="Tipo desconto"
            v-model="form.discountType"
            inline
          >
            <v-radio label="% Porcentagem" value="percentage"></v-radio>
            <v-radio label="R$ Valor" value="value"></v-radio>
          </v-radio-group>
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
      <pre>{{ form }}</pre>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
  data: {
    type: Object as () => VoucherFormProps,
    default: () => ({}),
  },
});

const { mobile } = useDisplay();
const consultationPackageStore = useServicePackageStore();
const show = defineModel({ default: false });

const form = ref({
  voucherName: "",
  description: "",
  discount: "",
  discountType: "percentage",
  expirationDate: "",
  packages: [] as VoucherItemsProps[],
});

const $packages = computed(() => {
  if (
    !consultationPackageStore.$all ||
    consultationPackageStore.$all.length === 0
  ) {
    return [];
  }

  return consultationPackageStore.$all.filter(
    (pkg) => !form.value.packages.some((p) => p.id === pkg.id)
  );
});

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

const handleSubmit = () => {
  // Handle form submission logic here
  console.log("Form submitted");
  show.value = false; // Close the dialog after submission
  clearForm();
};

const handleClose = () => {
  show.value = false;
  clearForm();
};

const loadForm = () => {
  form.value = {
    voucherName: props.data.voucherName || "",
    description: props.data.description || "",
    discount: props.data.discount || "",
    discountType: props.data.discountType || "percentage",
    expirationDate: props.data.expirationDate || "",
    packages: props.data.packages
      ? props.data.packages.map((pkg) => {
          return {
            ...pkg,
            isChecked: true, // Default to checked
          };
        })
      : [],
  };
};

const clearForm = () => {
  form.value = {
    voucherName: "",
    description: "",
    discount: "",
    discountType: "percentage",
    expirationDate: "",
    packages: [],
  };
};
</script>
