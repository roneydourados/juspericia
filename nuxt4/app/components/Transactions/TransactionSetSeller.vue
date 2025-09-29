<template>
  <DialogForm
    title="Vincular vendedor a transação"
    :show="show"
    @dialog="handleClose"
    :width="mobile ? '100%' : '40%'"
    borderColor="#c8e040"
  >
    <FormCrud :on-submit="handleConfirm">
      <v-row dense class="mt-">
        <v-col cols="12">
          <SelectSearchSeller v-model="model.seller" clearable required />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
  publicId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);

const { mobile } = useDisplay();
const transactionStore = useTransactionsStore();

const show = defineModel("show", {
  default: false,
});

const model = ref({
  seller: undefined as UserProps | undefined,
});

const handleConfirm = async () => {
  show.value = false;
  try {
    if (!props.publicId) {
      push.warning("Public ID is required");
    }

    if (!model.value.seller) {
      push.warning("Seller is required");
    }

    await transactionStore.setSeller({
      publicId: props.publicId,
      sellerId: model.value.seller?.id ?? 0,
    });

    handleClose();
    push.success("Seller set successfully");
  } catch (error) {
    console.log(error);
  }
};

const handleClose = () => {
  show.value = false;
  model.value = {
    seller: undefined,
  };
  emit("close");
};
</script>
