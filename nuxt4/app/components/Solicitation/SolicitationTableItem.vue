<template>
  <CardBlur
    v-if="!showTeleMedicine"
    style="border-top: 6px solid #c8e040"
    class="text-primary mt-2 mb-2"
    :hover="false"
  >
    <template #title style="gap: 1rem; font-size: 1rem">
      <div class="d-flex align-center justify-space-between item-header">
        <!-- <pre>{{ solicitation }}</pre> -->
        <div class="d-flex align-center" style="gap: 1rem">
          <div
            @click="handleDetailsClick(solicitation.publicId!)"
            class="text-truncate font-weight-bold"
            v-ripple
            style="cursor: pointer"
          >
            #{{ solicitation.id }} - Solicitação
            {{ solicitation.Consultation?.consultationName }}
          </div>
          <div
            class="d-flex align-center flex-wrap text-deep-purple"
            style="gap: 0.5rem"
            v-if="solicitation.Schedule && solicitation.Schedule.length > 0"
          >
            <span> Agendado: </span>
            <strong>
              {{
                dayjs(solicitation.Schedule?.[0]?.scheduleDate).format(
                  "DD/MM/YYYY"
                )
              }}
              as
              {{ solicitation.Schedule?.[0]?.scheduleHour }}
            </strong>
          </div>
        </div>
        <div
          class="d-flex flex-wrap align-center item-actions"
          style="gap: 1rem"
        >
          <Button
            v-if="
              solicitation.status === 'finished' &&
              !solicitation.PatientConsultationReport &&
              $currentUser?.profile?.type === 'ADMIN'
            "
            class="text-none font-weight-bold"
            color="info"
            variant="outlined"
            size="small"
            @click="handleGoSchedule(solicitation)"
          >
            <v-icon icon="mdi-calendar-clock" color="info" start />
            <span class="text-caption"> Voltar agenda </span>
          </Button>
          <Button
            v-if="
              solicitation.PatientConsultationReport &&
              solicitation.PatientConsultationReport.status === 'signed'
            "
            class="text-none font-weight-bold"
            color="info"
            @click="handleDownloadSignedFile(solicitation)"
            variant="outlined"
            size="small"
          >
            <v-icon icon="mdi-file-document-edit" color="colorIcon" start />
            <span class="text-caption"> Baixar Laudo </span>
          </Button>
          <v-chip
            v-else-if="
              !solicitation.PatientConsultationReport &&
              solicitation.status === 'finished'
            "
            variant="flat"
            color="#F6BF0C"
          >
            <span class="text-white text-caption"> Aguardando laudo </span>
          </v-chip>
          <v-chip
            v-else-if="
              solicitation.PatientConsultationReport &&
              solicitation.PatientConsultationReport.status !== 'signed'
            "
            variant="flat"
            color="grey"
          >
            <span class="text-white text-caption">
              Laudo aguardando assinatura
            </span>
          </v-chip>
          <Button
            v-if="
              solicitation.status === 'open' ||
              solicitation.status === 'payment_pending'
            "
            class="text-none text-white"
            color="grey"
            variant="outlined"
            size="small"
            @click="
              solicitation.sale
                ? handleReloadPayment(solicitation)
                : handleMountModelPrececkout(solicitation)
            "
          >
            <v-icon icon="mdi-credit-card-outline" color="primary" start />
            <span class="text-caption text-primary"> Pagar </span>
          </Button>
          <Button
            v-if="
              solicitation.sale &&
              solicitation.sale?.status === 'PENDING' &&
              solicitation.sale?.saleId &&
              $currentUser?.profile?.type === 'ADMIN'
            "
            class="text-none text-white"
            color="grey"
            variant="outlined"
            size="small"
            @click="handleCancelCobranca(solicitation)"
          >
            <v-icon icon="mdi-cancel" color="red" start />
            <span class="text-caption text-primary"> Cancelar Cobrança </span>
          </Button>
          <!-- <Button
            v-if="
              solicitation.status === 'scheduled' && solicitation.isTelemedicine
            "
            color="grey"
            size="small"
            variant="outlined"
            @click="handleQuery(solicitation)"
          >
            <v-icon icon="mdi-video-outline" start color="colorIcon" />
            <span class="text-caption text-primary"> Consulta </span>
          </Button> -->
          <Button
            v-if="solicitation.status === 'paid'"
            color="grey"
            size="small"
            variant="outlined"
            @click="handleSchedule(solicitation)"
          >
            <v-icon icon="mdi-calendar-clock" start color="colorIcon" />
            <span class="text-caption text-primary"> Agendar </span>
          </Button>
          <Button
            v-else-if="
              (solicitation.status === 'scheduled' ||
                solicitation.status === 'paid') &&
              $currentUser?.profile?.type === 'ADMIN'
            "
            color="grey"
            size="small"
            variant="outlined"
            @click="handleSchedule(solicitation)"
          >
            <v-icon icon="mdi-calendar-clock" start color="colorIcon" />
            <span class="text-caption text-primary"> Reagendar </span>
          </Button>
          <Button
            color="grey"
            size="small"
            variant="outlined"
            @click="cancelSolicitation(solicitation)"
            :disabled="
              (solicitation.status === 'finished' ||
                solicitation.status === 'canceled') &&
              $currentUser?.profile?.type !== 'ADMIN'
            "
          >
            <v-icon icon="mdi-cancel" start color="red" />
            <span class="text-caption text-primary"> cancelar </span>
          </Button>
          <Button
            color="grey"
            size="small"
            variant="outlined"
            @click="editItem(solicitation)"
            :disabled="
              (solicitation.status === 'finished' ||
                solicitation.status === 'canceled') &&
              $currentUser?.profile?.type !== 'ADMIN'
            "
          >
            <v-icon icon="mdi-pencil-outline" start color="colorIcon" />
            <span class="text-caption text-darkText"> Editar</span>
          </Button>
          <v-chip
            :color="solicitationStatusColor(solicitation.status ?? 'open')"
          >
            <div class="d-flex" style="gap: 0.5rem">
              <span>Status: </span>
              <span class="font-weight-bold">
                {{ solicitationStatusName(solicitation.status ?? "open") }}
              </span>
            </div>
          </v-chip>
        </div>
      </div>
    </template>
    <template #content class="px-8">
      <v-row>
        <v-col v-if="solicitation.proccessNumber" cols="12">
          <v-chip
            class="d-flex justify-center"
            style="width: 100%; gap: 0.5rem"
            label
            color="grey"
          >
            <span class="text-primary">Nº Processo:</span>
            <span class="font-weight-bold text-primary ml-2">
              {{ solicitation.proccessNumber }}
            </span>
          </v-chip>
        </v-col>

        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Solicitante:</span>
            <span class="font-weight-bold">
              {{ solicitation.Patient?.User?.name }}
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Paciente:</span>
            <span class="font-weight-bold">
              {{ solicitation.Patient?.name }}
              {{ solicitation.Patient?.surname }}
            </span>
          </div>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Finalidade:</span>
            <span class="font-weight-bold">
              {{ solicitation.ReportPurpose?.name }}
              {{
                solicitation.processSituation
                  ? solicitation.processSituation === "PD"
                    ? "Processo distribuido"
                    : "Processo andamento"
                  : ""
              }}
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Tipo benefício:</span>
            <span class="font-weight-bold">
              {{ solicitation.BenefitType?.name }}
            </span>
          </div>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Valor:</span>
            <span class="font-weight-bold">{{
              amountFormated(
                solicitation.valueCredit
                  ? Number(solicitation.valueCredit ?? 0)
                  : Number(solicitation.consultationValue ?? 0),
                true
              )
            }}</span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Valor atencipação:</span>
            <span class="font-weight-bold">
              {{ amountFormated(solicitation.antecipationValue ?? 0, true) }}
            </span>
          </div>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Solicitado:</span>
            <span class="font-weight-bold">
              {{ dayjs(solicitation.dateOpen).format("DD/MM/YYYY") }}
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Data limite para solicitar correção:</span>
            <span class="font-weight-bold">
              <!-- {{ dayjs(solicitation.deadline).format("DD/MM/YYYY") }} -->
              {{ $limiteDateCorrection }}
            </span>
          </div>

          <div class="d-flex" style="gap: 0.5rem">
            <span>Especialidade médica:</span>
            <span class="font-weight-bold">
              {{
                solicitation.medicalSpecialty?.medicalSpecialty ??
                "Não informado"
              }}
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Especialidade médica Valor:</span>
            <span class="font-weight-bold">
              {{
                amountFormated(solicitation.medicalSpecialtyValue ?? 0, true)
              }}
            </span>
          </div>
        </v-col>
        <v-col cols="12" lg="5" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Data do laudo:</span>
            <span class="font-weight-bold">
              {{
                solicitation.PatientConsultationReport
                  ? dayjs(
                      solicitation.PatientConsultationReport.reportDate?.substring(
                        0,
                        10
                      )
                    ).format("DD/MM/YYYY")
                  : "-"
              }}
              <!-- {{
                solicitation.dateCorrection
                  ? dayjs(solicitation.dateCorrection).format("DD/MM/YYYY")
                  : "Não solicitado"
              }} -->
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Data de solicitação de atencipação:</span>
            <span class="font-weight-bold">
              {{
                solicitation.dateAntecipation
                  ? dayjs(solicitation.dateAntecipation).format("DD/MM/YYYY")
                  : "Não solicitado"
              }}
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Antecipar em:</span>
            <span class="font-weight-bold">
              {{ solicitation.antecipationHours }}hs
            </span>
          </div>
        </v-col>
        <v-col
          v-if="$currentUser?.profile?.type !== 'MEDICO'"
          cols="12"
          lg="3"
          class="d-flex flex-column align-end"
          style="gap: 0.5rem"
        >
          <div
            class="pa-2 px-4 d-flex align-center justify-space-between w-100"
            style="background-color: #eeee; border-radius: 2rem"
          >
            <span class="text-primary">Total:</span>
            <span
              class="font-weight-bold text-primary"
              style="font-size: 1.3rem"
            >
              {{ amountFormated($solicitationTotal, true) }}
            </span>
          </div>
          <Button
            v-if="
              solicitation.criticisms &&
              solicitation.criticisms.length > 0 &&
              $currentUser?.profile?.type === 'ADVOGADO'
            "
            color="warning"
            @click="handleShowCriticism(solicitation)"
          >
            <v-icon icon="mdi-alert-circle-outline" start />
            <span class="text-caption"> Solicitação possui observações </span>
          </Button>
          <!-- Esses dois botões tem a mesma função, diferença que o debaixo sempre vai estar visivel para quem é adm -->
          <Button
            v-if="
              $currentUser?.profile?.type !== 'MEDICO' &&
              $currentUser?.profile?.type !== 'ADVOGADO'
            "
            variant="outlined"
            color="grey-darken-3"
            @click="handleShowCriticism(solicitation)"
            block
          >
            <v-icon icon="mdi-alert-circle-outline" start color="colorIcon" />
            <span class="text-caption">Lançar/Ver observações</span>
          </Button>
          <Button
            v-if="$currentUser?.profile?.type === 'ADMIN'"
            variant="outlined"
            color="warning"
            block
            @click="handleGetHistory(solicitation)"
          >
            <v-icon icon="mdi-history" start />
            <span class="text-caption"> Históricos </span>
          </Button>
          <Button
            v-if="
              $currentUser?.profile?.type === 'ADMIN' &&
              solicitation.status === 'finished'
            "
            variant="outlined"
            color="red"
            @click="handleRevertSolicitation(solicitation)"
            block
          >
            <v-icon icon="mdi-close" start />
            <span class="text-caption"> Estornar solicitação </span>
          </Button>
        </v-col>

        <v-col cols="12">
          <div
            v-if="
              solicitation.Schedule &&
              solicitation.Schedule?.[0]?.nuvidioInviteLink
            "
            class="d-flex align-center w-100"
            style="gap: 0.5rem"
          >
            <span>
              Agendamento com médico criado, clique no botão para copiar link:
            </span>

            <Button
              variant="text"
              @click="
                handleCopy(solicitation.Schedule?.[0]?.nuvidioInviteLink.link)
              "
            >
              <v-icon icon="mdi-content-copy" start color="colorIcon" />
              <span class="font-weight-bold" style="font-size: 0.7rem">
                Copiar link do agendamento
              </span>
            </Button>
          </div>
          <div
            v-if="
              ($currentUser?.profile?.type === 'ADMIN' ||
                $currentUser?.profile?.type === 'VENDEDOR' ||
                $currentUser?.profile?.type === 'FINANCEIRO' ||
                $currentUser?.profile?.type === 'ATENDENTE' ||
                $currentUser?.profile?.type === 'GERENTE') &&
              solicitation.medicId
            "
            class="d-flex align-center"
            style="gap: 0.5rem"
          >
            <span>Médico:</span>
            <strong>{{ solicitation.Medic?.name }}</strong>
          </div>
          <div
            v-if="
              $currentUser?.profile?.type === 'ADMIN' ||
              $currentUser?.profile?.type === 'VENDEDOR' ||
              $currentUser?.profile?.type === 'FINANCEIRO' ||
              $currentUser?.profile?.type === 'ATENDENTE' ||
              $currentUser?.profile?.type === 'GERENTE'
            "
          >
            <v-switch
              v-model="solicitation.showMedicalSpeciality"
              color="success"
              @update:model-value="
                handleUpdateShowMedicalSpeciality(
                  solicitation.showMedicalSpeciality
                )
              "
            >
              <template #label>
                <span>Mostrar especialidade no laudo</span>
              </template>
            </v-switch>
          </div>
        </v-col>
        <v-col cols="12">
          <v-divider />
        </v-col>
      </v-row>
      <v-row v-if="solicitation.files?.length ?? 0 > 0">
        <v-col cols="12" class="pa-4"><strong>Anexos / laudos</strong></v-col>
        <v-col
          cols="12"
          v-for="item in solicitation.files"
          :key="item.publicId"
        >
          <AttachementCard
            :file-name="item.fileName!"
            @download="handleDownloadFile(item.publicId!)"
            :delete-visible="false"
          />
        </v-col>
      </v-row>
    </template>
    <template
      #actions
      v-if="$currentUser?.profile?.type !== 'MEDICO'"
      class="px-8"
    >
      <v-row dense align="center">
        <v-col v-if="solicitation.status === 'finished'" cols="12" lg="2">
          <Button
            variant="text"
            color="grey"
            @click="handleShowCorrectionForm(solicitation)"
            :disabled="
              !solicitation.PatientConsultationReport || !$isEnableCorrection
            "
          >
            <v-icon
              icon="mdi-file-document-refresh-outline"
              start
              color="colorIcon"
            />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Solicitar correção
            </span>
          </Button>
        </v-col>
        <v-col
          v-if="
            !solicitation.dateAntecipation &&
            (solicitation.status === 'open' || solicitation.status === 'paid')
          "
          cols="12"
          lg="2"
        >
          <Button variant="text" @click="getItemAntecipation(solicitation)">
            <v-icon icon="mdi-calendar-clock-outline" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Solicitar antecipação
            </span>
          </Button>
        </v-col>
        <v-col
          v-else-if="
            solicitation.dateAntecipation &&
            (solicitation.status === 'open' || solicitation.status === 'paid')
          "
          cols="12"
          lg="2"
        >
          <Button
            variant="text"
            @click="handleCancelAntecipation(solicitation.publicId!)"
          >
            <v-icon icon="mdi-close" start color="red" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Cancelar antecipação
            </span>
          </Button>
        </v-col>
        <v-col cols="12" lg="2">
          <Button
            variant="text"
            @click="handleDetailsClick(solicitation.publicId!)"
          >
            <v-icon icon="mdi-dots-vertical" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Visualizar detalhes
            </span>
          </Button>
        </v-col>
        <v-col v-if="solicitation.status === 'finished'" cols="12" lg="3">
          <Button
            variant="text"
            @click="showTipValue = true"
            :disabled="Number(solicitation.tipValue) > 0"
          >
            <v-icon icon="mdi-currency-usd" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Dar Gorjeta
            </span>
          </Button>
        </v-col>
        <v-col
          v-if="$currentUser?.profile?.type === 'ADVOGADO'"
          cols="12"
          lg="3"
          class="d-flex flex-wrap align-center"
        >
          <Button
            v-if="
              Number(solicitation.rate ?? 0) === 0 &&
              solicitation.status === 'finished'
            "
            variant="text"
            @click="solicitation.rate = 1"
          >
            <v-icon icon="mdi-star" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Avaliar solicitação
            </span>
          </Button>
          <div
            v-if="Number(solicitation.rate ?? 0) > 0"
            class="d-flex align-center"
          >
            <v-rating
              v-model="solicitation.rate"
              active-color="colorIcon"
              color="colorIcon"
              :readonly="!isRate"
              :size="24"
            />
            <Button
              v-if="isRate"
              class="ml-2"
              variant="text"
              @click="handleUpdateRate(solicitation.rate ?? 0)"
            >
              <span class="text-primary text-caption"> Enviar </span>
              <v-icon icon="mdi-check" end color="colorIcon" />
            </Button>
          </div>
        </v-col>
        <v-col
          v-if="
            $currentUser?.profile?.type === 'ADMIN' &&
            solicitation.status === 'scheduled'
          "
          cols="12"
          lg="3"
        >
          <Button variant="text" @click="hadleSetRemoveMedic(solicitation)">
            <v-icon
              :icon="solicitation?.medicId ? 'mdi-close' : 'mdi-stethoscope'"
              start
              :color="solicitation?.medicId ? 'red' : 'colorIcon'"
            />
            <span class="text-primary text-caption">
              {{ solicitation?.medicId ? "Desvincular" : "Vincular" }} médico
            </span>
          </Button>
        </v-col>
      </v-row>
    </template>
  </CardBlur>
  <SolicitationCorrectionForm
    title="Solicitação de correção"
    v-model:show="showDateCorrection"
    :patient-consultation="selected"
    @close="selected = undefined"
  />
  <SolicitationAntecipationForm
    title="Solicitar antecipação"
    v-model:show="showDateAntecipation"
    :data="selected?.Consultation"
    @close="handleUpdateAntecipation($event)"
  />
  <SolicitationTipValue
    title="Valor da gorjeta"
    v-model:show="showTipValue"
    @close="handleTipValue($event)"
  />
  <ScheduleForm
    v-model="showSolicitationSchedule"
    :solicitation="selected"
    @update:model-value="
      !showSolicitationSchedule ? (selected = undefined) : selected
    "
    @scheduled="getSolicitations()"
    width="50%"
  />
  <DialogLoading :dialog="loading" />
  <!-- <Dialog
    title="Cancelar consulta"
    :dialog="showCancel"
    @cancel="showCancel = false"
    @confirm="cancel"
  >
    Tem certeza que deseja cancelar a consulta?
  </Dialog> -->
  <UserCreditSaltForm
    v-model="showSaltCredit"
    :solicitation="solicitation"
    @close="emit('refresh')"
  />
  <SolicitationPaymentReciptSalt
    v-model="showRecipt"
    :solicitation="solicitation"
  />
  <AsaasPreCheckout
    v-model:show="showSale"
    v-model="modelPrececkout"
    @confirm-sale="handleSaleItemForAsaas"
    @cancel="handleCancel"
  />
  <SolicitatiomSetScheduleMedic
    v-model:show="showSetMedicSchedule"
    :solicitation="solicitation"
    @close="getSolicitations"
  />
  <SolicitationCriticism
    v-model:show="showCriticism"
    :solicitation="solicitation"
  />
  <SolicitationDetailsDialog v-model:show="showSolicitationDetails" />
  <SolicitationHistories v-model:show="showHistories" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
const props = defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

const emit = defineEmits(["edit", "refresh"]);
const auth = useAuthStore();
const asaas = useAsaasStore();
const storeConsultation = useSolicitationConsultationStore();
const consultationReport = usePatientConsultationReportStore();
const scheduleStore = useScheduleStore();
//const rounter = useRouter();
const fileStore = useFileStore();
const zapSign = useZapsignStore();
const systemParameters = useSystemParametersStore();
const criticismStore = usePatientConsultationCriticismStore();
const saltCredit = useUserCreditSaltStore();

const { mobile } = useDisplay();

// const transactionsStore = useTransactionsStore();

const {
  amountFormated,
  getSolicitationsFilters,
  solicitationStatusName,
  solicitationStatusColor,
} = useUtils();
//const saltCredit = useUserCreditSaltStore();
//const router = useRouter();
const selected = ref<SolicitationConsultationProps>();
const showCriticism = ref(false);

const showTeleMedicine = ref(false);
const showSaltCredit = ref(false);
const isRate = ref(false);
const showDateCorrection = ref(false);
const showDateAntecipation = ref(false);
const showHistories = ref(false);
const showTipValue = ref(false);
const loading = ref(false);
const showSale = ref(false);
const showRecipt = ref(false);
const showSolicitationSchedule = ref(false);
const showSetMedicSchedule = ref(false);
const showSolicitationDetails = ref(false);
const filters = ref(getSolicitationsFilters());

const modelPrececkout = ref({
  name: "",
  description: "",
  dueDays: 2,
  paymentForm: "CREDIT_CARD",
  discountValue: undefined as number | undefined,
  discountType: undefined as string | undefined,
  installmentCount: 1,
  itemValue: 0,
  totalValue: 0,
  category: "package",
  packageId: undefined as number | undefined,
  voucherDesconto: "",
  totalBruteValue: 0,
  voucherId: undefined as number | undefined,
  publicSaleId: "",
  packgeSaleValue: 0,
  packgeQuantity: 1,
  userId: undefined as number | undefined,
});

const $userCreditTotalSalt = computed(() => saltCredit.$userCreditTotalSalt);
const $currentUser = computed(() => auth.$currentUser);
const $solicitationTotal = computed(() => {
  const value = props.solicitation.valueCredit
    ? Number(props.solicitation.valueCredit ?? 0)
    : Number(props.solicitation.consultationValue ?? 0);
  return (
    value +
    Number(props.solicitation.antecipationValue ?? 0) +
    Number(props.solicitation.medicalSpecialtyValue ?? 0)
  );
});
const $single = computed(() => storeConsultation.$single);
const $paymentResponse = computed(() => asaas.$paymentReponse);
const $systemParameters = computed(() => systemParameters.$parameters);
const $limiteDateCorrection = computed(() => {
  if (
    props.solicitation.PatientConsultationReport &&
    props.solicitation.PatientConsultationReport.reportDate
  ) {
    const dateLimit = dayjs(
      props.solicitation.PatientConsultationReport.reportDate.substring(0, 10)
    )
      .add(
        Number($systemParameters.value?.medicalReportRevisionMaxDays ?? 0),
        "day"
      )
      .format("DD/MM/YYYY");

    return dateLimit;
  }

  return "-";
});
const $isEnableCorrection = computed(() => {
  if (
    props.solicitation.PatientConsultationReport &&
    props.solicitation.PatientConsultationReport.reportDate
  ) {
    const daysPassed =
      dayjs().diff(
        dayjs(
          props.solicitation.PatientConsultationReport.reportDate.substring(
            0,
            10
          )
        ),
        "day"
      ) <= Number($systemParameters.value?.medicalReportRevisionMaxDays ?? 0);

    return (
      daysPassed &&
      Number(props.solicitation.correctionQuantity ?? 0) <
        Number($systemParameters.value?.medicalReportRevisionMaxCount ?? 0)
    );
  }

  return false;
});

watch(
  () => props.solicitation.id,
  () => {
    isRate.value = Number(props.solicitation.rate ?? 0) <= 0;
  },
  { immediate: true }
);

const handleDetailsClick = async (id: string) => {
  //await rounter.push(`/solicitations/${id}`);
  loading.value = true;
  try {
    await storeConsultation.show(id);
    showSolicitationDetails.value = true;
  } finally {
    loading.value = false;
  }
};

const editItem = (item: SolicitationConsultationProps) => {
  emit("edit", item);
};

const handleUpdateCorrection = async (motive: string) => {
  showDateCorrection.value = false;

  if (!props.solicitation.PatientConsultationReport) {
    push.warning("Laudo não encontrado!");
    return;
  }

  if (motive) {
    loading.value = true;
    try {
      // adiciona a justificativa no laudo
      await consultationReport.addJustify({
        justify: motive,
        publicId: props.solicitation.PatientConsultationReport.publicId!,
      });

      // incrementa a quantidade de correções
      await storeConsultation.update({
        publicId: props.solicitation.publicId,
        correctionQuantity:
          Number(props.solicitation.correctionQuantity ?? 0) + 1,
      });

      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleUpdateShowMedicalSpeciality = async (
  showMedicalSpeciality?: boolean
) => {
  loading.value = true;
  try {
    if (showMedicalSpeciality === undefined) {
      return;
    }
    // incrementa a quantidade de correções
    await storeConsultation.update({
      publicId: props.solicitation.publicId,
      showMedicalSpeciality,
    });

    await getSolicitations();
  } finally {
    loading.value = false;
  }
};

const handleUpdateAntecipation = async (item: any) => {
  showDateAntecipation.value = false;
  if (item.value && item.antecipationHours) {
    loading.value = true;
    try {
      await storeConsultation.solicitationSetAntecipation({
        publicId: props.solicitation.publicId,
        dateAntecipation: dayjs().format("YYYY-MM-DD"),
        antecipationValue: item.value,
        antecipationHours: item.antecipationHours,
      });

      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleCancelAntecipation = async (publicId: string) => {
  push.info({
    title: "Cancelar antecipação",
    message: "Tem certeza que deseja cancelar antecipação ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Confirmar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              await storeConsultation.solicitationCancelAntecipation(publicId);
              await getSolicitations();
            } catch (error) {
              push.error("Erro ao cancelar antecipação");
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};

const handleTipValue = async (value: number) => {
  if (value && value > 0) {
    loading.value = true;
    try {
      await storeConsultation.update({
        publicId: props.solicitation.publicId,
        tipValue: value,
      });

      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleUpdateRate = async (rate: number) => {
  loading.value = true;
  try {
    await storeConsultation.update({
      publicId: props.solicitation.publicId,
      rate,
    });
    isRate.value = false;
  } finally {
    loading.value = false;
  }
};

const getSolicitations = async () => {
  loading.value = true;
  filters.value = getSolicitationsFilters();

  try {
    await storeConsultation.index(filters.value);
  } finally {
    loading.value = false;
  }
};

const cancelSolicitation = (item: SolicitationConsultationProps) => {
  push.info({
    title: "Cancelar Solicitação",
    message: "Tem certeza que deseja cancelar esta solicitação ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Sim",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              await storeConsultation.update({
                ...item,
                status: "canceled",
              });

              if (item.sale && item.sale.saleId) {
                await asaas.deletePayment(item.sale.saleId);
              }

              await getSolicitations();
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Não",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
  // selected.value = item;
  // showCancel.value = true;
};

const getItemAntecipation = (item: SolicitationConsultationProps) => {
  selected.value = item;
  showDateAntecipation.value = true;
};

// const cancel = async () => {
//   showCancel.value = false;
//   if (!selected.value) return;

//   loading.value = true;

//   try {
//     await storeConsultation.update({
//       ...selected.value,
//       status: "canceled",
//     });

//     if (selected.value.sale && selected.value.sale.saleId) {
//       await asaas.deletePayment(selected.value.sale.saleId);
//     }

//     await getSolicitations();
//     selected.value = undefined;
//   } finally {
//     loading.value = false;
//   }
// };

const handleSchedule = (item: SolicitationConsultationProps) => {
  if (item.medicId) {
    push.warning(
      "Para agendar ou reagendar uma  solicitação, é necessário desvincular o médico primeiro !"
    );
    return;
  }

  selected.value = item;
  showSolicitationSchedule.value = true;
};

const handleMountModelPrececkout = async (
  item: SolicitationConsultationProps
) => {
  //Verificar se o usuário possui um total em saldo de crédito que de para pagar a solicitação
  await saltCredit.getTotalSalt(item.Patient?.User?.publicId!);

  if (
    $userCreditTotalSalt.value &&
    Number($userCreditTotalSalt.value.totalSalt) >=
      Number($solicitationTotal.value)
  ) {
    push.info({
      title: "Saldo de crédito disponível",
      message: `Detectamos que você possui um saldo de crédito de ${amountFormated(
        $userCreditTotalSalt.value?.totalSalt ?? 0,
        true
      )}. Esta solicitação será baixada automaticamente.`,
      duration: Infinity, // Não fecha automaticamente
      props: {
        isModal: true, // Propriedade customizada para identificar como modal
        preventOverlayClose: true, // Impede fechar clicando no overlay
        preventEscapeClose: false, // Permite fechar com ESC
        actions: [
          {
            label: "Confirmar",
            variant: "primary",
            icon: "mdi-file-rotate-right-outline",
            iconColor: "colorIcon",
            handler: async () => {
              loading.value = true;
              try {
                await storeConsultation.paidUseSalt(item.publicId!);
                await getSolicitations();
              } catch (error) {
                console.log("🚀 ~ handleFinalizeSchedule ~ error:", error);
              } finally {
                loading.value = false;
              }
            },
          },
          {
            label: "Cancelar",
            variant: "secondary",
            icon: "mdi-close",
            iconColor: "red",
            handler: () => {},
          },
        ],
      },
    });

    return;
  }

  //refazer a consulta aqui só para garantir que está com os dados mais recentes
  await storeConsultation.show(item.publicId!);

  //caso já tenha uma venda vinculada, recarregar o pagamento
  if ($single.value?.sale) {
    await handleReloadPayment(item);
    return;
  }

  //verificar se já existe uma venda vinculada e se ainda está disponível para pagamento no asaas
  if (item.sale && item.sale.saleId) {
    // este método aqui já cancela a venda vinculada ao pagament
    await asaas.deletePayment(item.sale.saleId);
  }
  showSale.value = true;
  modelPrececkout.value = {
    name: `Solicitação de consulta Nº ${item.id} do paciente ${item.Patient?.name} ${item.Patient?.surname}`,
    description: `Solicitação de consulta Nº ${item.id} do paciente ${item.Patient?.name} ${item.Patient?.surname}`,
    dueDays: 2,
    paymentForm: "CREDIT_CARD",
    discountValue: undefined,
    discountType: undefined,
    installmentCount: 1,
    itemValue: $solicitationTotal.value,
    totalValue: $solicitationTotal.value,
    category: "solicitation",
    totalBruteValue: $solicitationTotal.value,
    packageId: undefined,
    voucherDesconto: "",
    voucherId: undefined,
    publicSaleId: "",
    packgeSaleValue: $solicitationTotal.value, // valor do pacote, no caso é uma solicitação única
    packgeQuantity: 1, //atende apenas uma solicitação
    userId: item.userId,
  };
};

const handleSaleItemForAsaas = async () => {
  showSale.value = false;
  loading.value = true;
  try {
    if (!props.solicitation) {
      push.warning("Solicitação não encontrada!");
    }

    if (
      modelPrececkout.value.installmentCount &&
      modelPrececkout.value.installmentCount > 1
    ) {
      //se for parcelada enviar quantidade de parcelas e o valor total
      await asaas.createPayment({
        dueDate: dayjs()
          .add(modelPrececkout.value.dueDays, "days")
          .format("YYYY-MM-DD"),
        description: modelPrececkout.value.name,
        category: modelPrececkout.value.category,
        //packageId: props.item.id,
        dueDays: modelPrececkout.value.dueDays,
        totalValue: modelPrececkout.value.totalValue,
        installmentCount: modelPrececkout.value.installmentCount,
        billingType: modelPrececkout.value.paymentForm,
        voucherId: modelPrececkout.value.voucherId,
        userId: modelPrececkout.value.userId ?? $currentUser.value!.id!, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
        discount: {
          value: modelPrececkout.value.discountValue ?? 0,
          type: modelPrececkout.value.discountType,
        },
        saleValue: modelPrececkout.value.totalValue ?? 0,
        publicSaleId: modelPrececkout.value.publicSaleId,
        packgeQuantity: modelPrececkout.value.packgeQuantity ?? 1,
        packgeSaleValue: modelPrececkout.value.packgeSaleValue ?? 0,
        solicitationId: props.solicitation.id,
        discountValue: modelPrececkout.value.discountValue ?? 0,
      });
    } else {
      const payload = {
        dueDate: dayjs()
          .add(modelPrececkout.value.dueDays, "days")
          .format("YYYY-MM-DD"),
        value: modelPrececkout.value.totalValue,
        description: modelPrececkout.value.name!,
        category: modelPrececkout.value.category,
        dueDays: modelPrececkout.value.dueDays,
        billingType: modelPrececkout.value.paymentForm,
        voucherId: modelPrececkout.value.voucherId,
        userId: modelPrececkout.value.userId ?? $currentUser.value!.id!, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
        discount: {
          value: modelPrececkout.value.discountValue ?? 0,
          type: modelPrececkout.value.discountType,
        },
        saleValue: modelPrececkout.value.totalValue ?? 0,
        publicSaleId: modelPrececkout.value.publicSaleId,
        packgeQuantity: modelPrececkout.value.packgeQuantity ?? 1,
        packgeSaleValue: modelPrececkout.value.packgeSaleValue ?? 0,
        solicitationId: props.solicitation.id,
        discountValue: modelPrececkout.value.discountValue ?? 0,
      };

      await asaas.createPayment(payload);
    }

    if ($paymentResponse.value?.data?.invoiceUrl) {
      window.open($paymentResponse.value.data.invoiceUrl, "_blank");
    }
    await getSolicitations();
  } catch (error) {
    push.error("Erro ao finalizar pagamento");
    console.log("🚀 ~ handleSaleItem ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleReloadPayment = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    if (!item.sale) {
      push.warning("Pagamento não encontrado");
      return;
    }

    // se a fatura já estiver vencida e em aberto, então apagar e gerar outra
    if (dayjs().isAfter(dayjs(item.sale.dueDate))) {
      await asaas.deletePayment(item.sale.saleId!);
      await getSolicitations();
      await handleSaleItemForAsaas();
      return;
    }

    //caso contrário, apenas abrir a fatura
    // const screenWidth = window.screen.width;
    // const screenHeight = window.screen.height;
    // const popupWidth = Math.round(screenWidth * 0.95);
    // const popupHeight = Math.round(screenHeight * 0.95);
    // const popupLeft = Math.round((screenWidth - popupWidth) / 2);
    // const popupTop = Math.round((screenHeight - popupHeight) / 2);

    // const popup = window.open(
    //   item.sale.invoiceUrl,
    //   "_blank",
    //   `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
    // );
    // abrir a fatura em uma nova aba
    const popup = window.open(item.sale.invoiceUrl, "_blank");
    if (popup) popup.focus();

    // verificar se o popup foi fechado
    const popupChecker = setInterval(async () => {
      if (popup && popup.closed) {
        clearInterval(popupChecker);
        await getSolicitations();
      }
    }, 700);
  } catch (error) {
    console.log("🚀 ~ handleReloadPayment ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleDownloadFile = async (publicId: string) => {
  loading.value = true;
  try {
    const { file, fileName } = await fileStore.downloadAws(publicId);

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(file);

    // Cria um link temporário
    const link = document.createElement("a");
    link.href = url;

    // Define o nome do arquivo
    link.download = fileName;

    // Adiciona e clica no link
    document.body.appendChild(link);
    link.click();

    // Remove o link temporário
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("🚀 ~ handleDownloadFile ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = async () => {
  await getSolicitations();
  showSale.value = false;
  modelPrececkout.value = {
    name: "",
    description: "",
    dueDays: 2,
    paymentForm: "CREDIT_CARD",
    discountValue: undefined,
    discountType: undefined,
    installmentCount: 1,
    itemValue: 0,
    totalValue: 0,
    category: "package",
    packageId: undefined,
    voucherDesconto: "",
    totalBruteValue: 0,
    voucherId: undefined,
    publicSaleId: "",
    packgeSaleValue: 0,
    packgeQuantity: 1,
    userId: undefined,
  };
};

const handleDownloadSignedFile = async (
  item: SolicitationConsultationProps
) => {
  if (!item.PatientConsultationReport) {
    push.error("Documento não assinado.");
    return;
  }

  loading.value = true;
  try {
    const { fileBlob, fileName } = await zapSign.getSignedFile(
      item.PatientConsultationReport.publicId!
    );

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(fileBlob);

    // Cria um link temporário
    const link = document.createElement("a");
    link.href = url;

    // Define o nome do arquivo
    link.download = fileName;

    // Adiciona e clica no link
    document.body.appendChild(link);
    link.click();

    // Remove o link temporário
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("🚀 ~ handleDownloadSignedFile ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      push.success("Link copiado para a área de transferência");
    })
    .catch(() => {
      push.warning("Erro ao copiar link tente novamente");
    });
};

const hadleSetRemoveMedic = async (
  solicitation: SolicitationConsultationProps
) => {
  if (solicitation.medicId) {
    push.info({
      title: "Remover vínculo com médico",
      message: "Confirma remover o vínculo com o médico?",
      duration: Infinity, // Não fecha automaticamente
      props: {
        isModal: true, // Propriedade customizada para identificar como modal
        preventOverlayClose: true, // Impede fechar clicando no overlay
        preventEscapeClose: false, // Permite fechar com ESC
        actions: [
          {
            label: "Remover",
            variant: "primary",
            icon: "mdi-file-rotate-right-outline",
            iconColor: "colorIcon",
            handler: async () => {
              loading.value = true;
              try {
                if (!solicitation?.Schedule?.[0]?.publicId) {
                  push.success("Não foi possível encontrar a agenda!");
                  return;
                }

                //atualizar a agenda para start
                await scheduleStore.clearMedicSchedule(
                  solicitation.Schedule?.[0]?.publicId!
                );

                await getSolicitations();
                push.success("Médico desvinculado com sucesso");
              } catch (error) {
                console.log("🚀 ~ handleFinalizeSchedule ~ error:", error);
              } finally {
                loading.value = false;
              }
            },
          },
          {
            label: "Cancelar",
            variant: "secondary",
            icon: "mdi-close",
            iconColor: "red",
            handler: () => {},
          },
        ],
      },
    });
  } else {
    showSetMedicSchedule.value = true;
  }
};

const handleShowCriticism = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    await criticismStore.listCriticisms(item.id!);
    showCriticism.value = true;
  } catch (error) {
    console.log("🚀 ~ handleShowCriticism ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancelCobranca = (item: SolicitationConsultationProps) => {
  push.info({
    title: "Cancelar cobrança gerada",
    message:
      "Esta função irá apagar a cobrança gerada para esta solicitação, não poderá ser desfeita. Deseja continuar ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Confirmar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              await asaas.deletePayment(item.sale?.saleId!);
              await getSolicitations();
            } catch (error) {
              push.error("Erro ao cancelar cobrança");
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};

const handleGoSchedule = async (item: SolicitationConsultationProps) => {
  push.info({
    title: "Retornar ao agendamento",
    message:
      "Tem certeza que deseja retornar solicitação finalizada para agendamento ? Esta acção não pode ser desfeita.",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Confirmar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            filters.value = getSolicitationsFilters();

            try {
              await storeConsultation.returnScheduled(item.publicId!);
              await getSolicitations();
            } catch (error) {
              push.error("Erro ao retornar ao agendamento");
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};

const handleShowCorrectionForm = (item: SolicitationConsultationProps) => {
  selected.value = item;
  showDateCorrection.value = true;
};

const handleRevertSolicitation = async (
  item: SolicitationConsultationProps
) => {
  push.info({
    title: "Estornar solicitação",
    message:
      "Tem certeza que deseja estornar esta solicitação ? Todo trabalho realizado será perdido e a solicitação volta para status de um novo agendamento. Esta ação não pode ser desfeita. Confirma ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Confirmar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              await storeConsultation.revertSolicitation(item.publicId!);
              await getSolicitations();
            } catch (error) {
              push.error("Erro ao cancelar antecipação");
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};

const handleGetHistory = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    await storeConsultation.getHistories(item.publicId!);
    showHistories.value = true;
  } catch (error) {
    console.log("🚀 ~ handleGetHistory ~ error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.item-header {
  gap: 1rem;
}

@media (max-width: 600px) {
  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .item-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .item-actions :deep(.v-btn),
  .item-actions :deep(.v-chip) {
    width: 100%;
    justify-content: center;
  }
}
</style>
