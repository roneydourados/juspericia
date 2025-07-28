<template>
  <DialogForm
    :show="show"
    title="Trasnferir saldo"
    @dialog="handleCloseForm"
    :width="mobile ? '100%' : '60%'"
  >
    <v-row>
      <v-col cols="12" lg="6">
        <v-card rounded="lg" height="100%">
          <v-card-title>
            <strong> Origem </strong>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-column">
              <div
                class="d-flex flex-wrap align-centrer mt-4"
                style="gap: 0.5rem"
              >
                <span>Transferir</span>
                <strong>{{ originTransfer?.description }}</strong>
              </div>
              <div class="d-flex align-centrer mt-4" style="gap: 0.5rem">
                <span>Saldo</span>
                <strong>
                  {{
                    amountFormated(Number(originTransfer?.salt ?? "0"), true)
                  }}
                </strong>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card rounded="lg" height="100%">
          <v-card-title>
            <strong> Selecionar Destino </strong>
          </v-card-title>
          <v-card-text>
            <SelectSearchUserCreditTrasnferDestiny
              v-model="userCreditDestiny"
              :public-id-exclude="originTransfer?.publicId"
              clearable
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-flex align-center justify-end">
        <v-btn
          color="success"
          variant="flat"
          class="text-none"
          size="small"
          prepend-icon="mdi-swap-horizontal"
          @click="showConfirmTransfer = true"
        >
          Transferir
        </v-btn>
      </v-col>
    </v-row>
    <Dialog
      title="CONFIRME"
      :dialog="showConfirmTransfer"
      @cancel="showConfirmTransfer = false"
      @confirm="handleConfirmTransfer"
      show-cancel
    >
      <span>Confirma a transferência do saldo ? </span>
    </Dialog>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
  originTransfer: {
    type: Object as PropType<UserCreditSalt>,
    default: () => ({} as UserCreditSalt),
  },
});

const emit = defineEmits(["close"]);

const { mobile } = useDisplay();
const { amountFormated } = useUtils();
const saltCredit = useUserCreditSaltStore();
const showConfirmTransfer = ref(false);
const show = defineModel({
  default: false,
});

const userCreditDestiny = ref<UserCreditSalt | undefined>(undefined);

const handleConfirmTransfer = async () => {
  if (!userCreditDestiny.value) return;
  if (!props.originTransfer) return;

  try {
    const payload = {
      publicIdOrigin: props.originTransfer.publicId!,
      publicIdDestination: userCreditDestiny.value.publicId!,
    };
    await saltCredit.transferSalt(payload);
  } catch (error) {
    console.error("Transfer failed:", error);
  } finally {
    handleCloseForm();
  }
};

const handleCloseForm = () => {
  show.value = false;
  showConfirmTransfer.value = false;
  userCreditDestiny.value = undefined;
  emit("close");
};
</script>
