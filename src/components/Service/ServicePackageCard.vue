<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    class="mx-auto my-12"
    max-width="95%"
    rounded="lg"
    elevation="8"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      height="250"
      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      cover
    ></v-img>

    <v-card-item>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-subtitle>
        <span class="me-1">Mais simples</span>

        <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-row align="center" class="mx-0">
        <v-rating
          :model-value="4.5"
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        ></v-rating>

        <div class="text-grey ms-4">4.5 (413)</div>
      </v-row>

      <div class="my-4 text-subtitle-1">• Pacote de consultas</div>

      <div>
        Pacote de consultas oferecidas pela plataforma, de uma forma que
        comprando por aqui fica muito mais barata
      </div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Preço</v-card-title>

    <div class="px-4 mb-2">
      <v-chip color="deep-purple-lighten-2" label>
        <strong style="font-size: 1rem">
          R$ {{ amountFormated(value, false) }}
        </strong>
      </v-chip>
    </div>

    <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        text="Comprar"
        block
        variant="flat"
        @click="showSale = true"
      />
    </v-card-actions>
  </v-card>
  <Dialog
    title="CONFIRME"
    :dialog="showSale"
    @cancel="showSale = false"
    @confirm="handleSaleItem"
    show-cancel
  >
    <div class="d-flex flex-column">
      <span>confirma a compra de {{ title }} ? </span>
      Valor: <strong>{{ amountFormated(value, false) }}</strong>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { uuidv7 } from "uuidv7";
import moment from "moment";

const props = defineProps({
  title: {
    type: String,
    default: "Pacote de serviços",
  },
  category: {
    type: String,
    default: "",
  },
  value: {
    type: Number,
    default: 0,
  },
});

const saltCredit = useUserCreditSaltStore();
const { amountFormated } = useUtils();
const loading = ref(false);
const showSale = ref(false);

const handleSaleItem = async (item: any) => {
  showSale.value = false;
  loading.value = true;
  try {
    const payload = {
      salt: props.value,
      saltCategory: props.category,
      expiredAt: moment().add(1, "month").format("YYYY-MM-DD"),
      UserCreditPayment: [
        {
          paymentForm: "PIX",
          value: props.value,
          chargeId: uuidv7(),
          status: "paid",
        },
      ],
    };

    await saltCredit.create(payload);

    push.success("Compra realizada com sucesso");
  } catch (error) {
    console.log("🚀 ~ handleSaleItem ~ error:", error);
    push.error("Erro ao realizar a compra");
  } finally {
    loading.value = false;
  }
};
</script>
