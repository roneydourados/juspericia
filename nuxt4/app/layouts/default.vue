<template>
  <v-app>
    <LayoutDrawer
      :drawer="drawer"
      :mobile="mobile"
      @update:drawer="drawer = $event"
    />

    <v-app-bar
      elevation="0"
      :class="`${$currentTheme === 'mainThemeDark' ? '' : 'toolbar-color'}`"
      :color="`${$currentTheme === 'mainThemeDark' ? 'bgcolor' : ''}`"
      border="0"
    >
      <template #title>
        <v-app-bar-nav-icon
          v-if="mobile"
          variant="text"
          color="white"
          @click.stop="drawer = !drawer"
        />
      </template>
      <template v-slot:append>
        <div
          v-if="$currentUser?.profile?.type === 'ADVOGADO'"
          class="d-flex align-center px-4"
          style="gap: 0.5rem"
        >
          <Button
            class="text-none"
            color="colorIcon"
            size="small"
            :variant="mobile ? 'text' : 'outlined'"
            @click="router.push('/services-packages')"
          >
            <span v-if="!mobile" class="text-caption text-white">
              Comprar créditos
            </span>
            <v-icon icon="mdi-cash-plus" color="colorIcon" end />
            <v-tooltip
              v-if="mobile"
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Comprar créditos
            </v-tooltip>
          </Button>

          <Button
            class="text-none"
            color="#2B4BAD"
            size="small"
            :variant="mobile ? 'text' : 'flat'"
            @click="handleNewSolicitation"
          >
            <span v-if="!mobile" class="text-caption"> Nova solicitação </span>
            <v-icon icon="mdi-cart-plus" color="colorIcon" end />
            <v-tooltip
              v-if="mobile"
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Nova solicitação
            </v-tooltip>
          </Button>
        </div>
        <div
          v-if="!mobile"
          class="d-flex flex-column align-end px-6 text-white"
        >
          <span class="font-weight-bold">
            {{ $currentUser?.name }}
          </span>
          <span class="">
            {{ $currentUser?.profile?.profileName }}
          </span>
        </div>
        <v-btn
          icon
          @click="themeStore.toggleTheme"
          :aria-label="
            themeStore.$isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
          "
        >
          <v-icon color="white">
            {{ themeStore.$isDark ? "mdi-weather-sunny" : "mdi-weather-night" }}
          </v-icon>
        </v-btn>

        <div
          :class="
            mobile ? 'd-flex align-center px-2' : 'px-2 d-flex align-center'
          "
          style="gap: 1rem"
        >
          <v-menu
            v-if="$currentUser?.profile?.type === 'ADVOGADO'"
            rounded
            v-model="menuFeedback"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                size="small"
                variant="text"
                class="text-none"
                stacked
                color="white"
                v-bind="props"
                @click="menuFeedback = true"
              >
                <v-badge
                  color="error"
                  :content="$npsPending.length"
                  v-if="$npsPending.length > 0"
                >
                  <v-icon icon="mdi-bell-outline" />
                </v-badge>
                <v-icon v-else icon="mdi-bell-outline" />
              </v-btn>
            </template>

            <v-card rounded="xl" min-width="300" max-height="500">
              <v-list lines="three">
                <v-list-item>
                  <v-list-item-title>
                    <div class="d-flex justify-space-between px-2">
                      <strong style="font-size: 1.3rem">Notificações</strong>
                      <v-icon
                        icon="mdi-history"
                        color="orange-darken-1"
                        size="30"
                      />
                    </div>
                  </v-list-item-title>
                </v-list-item>
                <div
                  v-if="$npsPending.length === 0"
                  class="d-flex flex-column align-center pa-4"
                  style="gap: 0.5rem"
                >
                  <v-icon icon="mdi-history" color="grey" size="30" />
                  <span style="font-size: 1rem" class="text-grey-darken-2">
                    Sem notificações por enquanto
                  </span>
                </div>
                <v-list-item v-for="nps in $npsPending" :key="nps.id">
                  <v-list-item-title class="font-weight-bold">
                    Nova pesquisa de satisfação disponível!
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <div class="d-flex flex-column mb-6" style="gap: 0.5rem">
                      <span>
                        Clique aqui para responder a pesquisa de satisfação.
                      </span>
                      <span>
                        Solicitação Nº: {{ nps.patientConsultationId }},
                        paciente: {{ nps.patientConsultation?.Patient?.name }}
                        {{ nps.patientConsultation?.Patient?.surname }}
                      </span>
                    </div>
                  </v-list-item-subtitle>
                  <v-list-item-action>
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      @click="showFeedbackDialogHandler(nps)"
                    >
                      <v-icon
                        icon="mdi-message-arrow-right-outline"
                        color="primary"
                        start
                      />
                      <span class="text-caption text-colorTextPrimary">
                        Responder
                      </span>
                    </Button>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

          <v-menu rounded>
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                v-bind="props"
                color="darkgreen"
                variant="tonal"
                size="small"
              >
                <v-avatar>
                  <v-icon icon="mdi-account-outline" color="white" />
                </v-avatar>
              </v-btn>
            </template>
            <v-card min-width="200" color="surface" rounded="xl">
              <v-card-text>
                <div class="mx-auto text-center">
                  <v-avatar color="primary" variant="tonal" size="50">
                    <v-icon icon="mdi-account-outline" color="primary" />
                  </v-avatar>
                  <h3 class="mt-2">{{ $currentUser?.name }}</h3>
                  <p class="text-caption text-grey-darken-1 mt-1">
                    {{ $currentUser?.email }}
                  </p>
                  <v-divider class="my-3"></v-divider>
                  <v-btn
                    block
                    class="text-none"
                    variant="text"
                    @click="handleLogout"
                  >
                    <v-icon class="mr-2">mdi-logout</v-icon>
                    Sair
                  </v-btn>
                  <v-btn
                    block
                    class="text-none"
                    variant="text"
                    @click="handleRevokeConsent"
                  >
                    <v-icon class="mr-2" icon="mdi-file-rotate-right-outline" />
                    Revogar termos de uso
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </div>
      </template>
    </v-app-bar>
    <v-main class="container d-flex justify-center">
      <div
        :class="mobile ? 'w-100 px-2' : 'w-100 pa-4'"
        style="
          background-color: rgb(var(--v-theme-background)) !important;
          max-width: 95%;
        "
      >
        <slot />
        <SuportButton />
      </div>
    </v-main>
    <v-footer app name="footer" height="30" color="bgcolor">
      <span class="text-caption">
        &copy; GaleCode - {{ new Date().getFullYear() }}
      </span>
      <v-spacer></v-spacer>
      <span class="text-caption font-weight-bold">v{{ $version }}</span>
    </v-footer>
    <FeedbackDialog v-model="showFeedbackDialog" :nps="selectedNps" />
    <FeedbackDialogGeneralNps v-model="showFeedbackGeneralDialog" />
  </v-app>
</template>
<script setup lang="ts">
// import { useThemeStore } from "@/store/theme";
// import { MAIN_THEME_DARK, MAIN_THEME } from "@/utils/vuetifyTheme";
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

// const storeTheme = useThemeStore();
// const globalTheme = useTheme();

const { mobile } = useDisplay();
// const screen = useScreenStore();
const config = useRuntimeConfig();
const router = useRouter();
const auth = useAuthStore();
const npsStore = useNpsStore();
//const { getInitials } = useUtils();

const drawer = ref(true);
const showFeedbackDialog = ref(false);
const showFeedbackGeneralDialog = ref(false);
const menuFeedback = ref(false);

const selectedNps = ref<NPSProps>();
const $currentUser = computed(() => auth.$currentUser);
const $version = computed(() => config.public.version);
const $npsPending = computed(() => npsStore.$npsList);

const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

onMounted(async () => {
  if ($currentUser.value?.profile?.type === "ADVOGADO") {
    const monthRef = dayjs().format("YYYY-MM");

    await npsStore.getNpsPending();
    const isEligible = await npsStore.checkUserEligibleForNps(monthRef);

    showFeedbackGeneralDialog.value = isEligible;
  }
  themeStore.initTheme();
  closeDrawer();
});

const closeDrawer = () => {
  if (mobile.value) {
    drawer.value = false;
  }
};

const handleNewSolicitation = async () => {
  await router.push("/solicitations/new");
};

const handleLogout = () => {
  auth.logout();
  router.push("/");
};

const handleRevokeConsent = async () => {
  push.info({
    title: "Revogar consentimento",
    message:
      "Tem certeza que deseja revogar o consentimento aos termos de uso?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Revogar termos de uso",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            await auth.revokeConset($currentUser.value?.userConsent?.publicId!);
            auth.logout();
            router.push("/");
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

const showFeedbackDialogHandler = (item: NPSProps) => {
  selectedNps.value = item;
  showFeedbackDialog.value = true;
  menuFeedback.value = false;
};
</script>

<style scoped>
.toolbar-color {
  background: linear-gradient(to right, #1e3c98, #4d84d5) !important;
}
</style>
