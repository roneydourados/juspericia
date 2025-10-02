<template>
  <DialogForm title="" :show="show" fullscreen @dialog="show = false">
    <v-row class="fill-height">
      <!-- Coluna da Lista de Críticas -->
      <v-col cols="12" md="6" class="border-e">
        <v-card flat class="h-100 d-flex flex-column">
          <v-card-title
            class="d-flex justify-space-between align-center flex-shrink-0"
          >
            <span style="font-size: 1.2rem; font-weight: 600"
              >Observações da Solicitação</span
            >
            <Button
              v-if="$currentUser?.profile?.type === 'ADMIN'"
              color="primary"
              variant="outlined"
              size="small"
              @click="showNewCriticismDialog = true"
            >
              <v-icon icon="mdi-plus" start />
              Nova Observação
            </Button>
          </v-card-title>
          <v-card-text class="pa-0">
            <div class="criticisms-list">
              <v-list v-if="criticisms?.length" density="compact" lines="three">
                <v-list-item
                  v-for="criticism in criticisms"
                  :key="criticism.id"
                  :active="selectedCriticism?.id === criticism.id"
                  @click="selectCriticism(criticism)"
                  class="mb-2"
                >
                  <template #prepend>
                    <v-avatar
                      :color="getStatusColor(criticism.status)"
                      size="small"
                    >
                      <v-icon icon="mdi-comment-text-outline" size="small" />
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-wrap">
                    {{ criticism.description || "Crítica sem descrição" }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    Status: {{ criticism.status || "Pendente" }}
                    <br />
                    Mensagens: {{ criticism.messages?.length || 0 }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn
                      v-if="$currentUser?.profile?.type === 'ADMIN'"
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      @click.stop="editCriticismFromList(criticism)"
                    />
                  </template>
                </v-list-item>
              </v-list>
              <v-empty-state
                v-else
                icon="mdi-comment-alert-outline"
                title="Nenhuma crítica encontrada"
                text="Clique no botão acima para criar uma nova crítica."
                class="my-8"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Coluna das Mensagens -->
      <v-col cols="12" md="6">
        <v-card v-if="selectedCriticism" flat class="h-100 d-flex flex-column">
          <v-card-title>
            <div
              class="d-flex justify-space-between align-center flex-shrink-0"
            >
              <span>Mensagens da Crítica</span>
              <v-chip color="primary" size="small" class="ml-2">
                {{ selectedCriticism.status || "Pendente" }}
              </v-chip>
            </div>
          </v-card-title>

          <!-- Chat Container -->
          <v-card-text class="pa-0 flex-grow-1 d-flex flex-column">
            <div class="messages-container">
              <div
                v-if="selectedCriticism.messages?.length"
                class="messages-list"
                ref="chatContainer"
              >
                <div
                  v-for="message in selectedCriticism.messages"
                  :key="message.id"
                  :class="[
                    'message-item',
                    message.userId === $currentUser?.id
                      ? 'message-sent'
                      : 'message-received',
                  ]"
                >
                  <div class="message-bubble">
                    <div class="message-content">{{ message.message }}</div>
                    <div class="message-time">
                      {{ message.user?.name || "Usuário" }}
                    </div>
                    <div class="message-time">
                      {{ formatDateTime(message.createdAt) }}
                    </div>
                  </div>
                </div>
              </div>
              <v-empty-state
                v-else
                icon="mdi-chat-outline"
                title="Nenhuma mensagem"
                text="Seja o primeiro a enviar uma mensagem."
                class="my-8"
              />
            </div>
          </v-card-text>

          <!-- Input de Nova Mensagem -->
          <v-card-actions class="pa-4 flex-shrink-0">
            <FormCrud
              :on-submit="sendMessage"
              :show-submit-button="false"
              class="w-100"
            >
              <v-row>
                <v-col cols="12">
                  <StringInput
                    v-model="newMessage"
                    placeholder="Digite sua mensagem..."
                    variant="outlined"
                    density="compact"
                    hide-details
                    @keyup.enter="sendMessage"
                  >
                    <template #append-inner>
                      <v-btn
                        icon="mdi-send"
                        color="primary"
                        variant="text"
                        size="small"
                        type="submit"
                        :disabled="!newMessage.trim()"
                      />
                    </template>
                  </StringInput>
                </v-col>
              </v-row>
            </FormCrud>
          </v-card-actions>
        </v-card>

        <!-- Estado quando nenhuma crítica está selecionada -->
        <v-card v-else flat class="h-100 d-flex align-center justify-center">
          <v-empty-state
            icon="mdi-chat-processing-outline"
            title="Selecione uma crítica"
            text="Clique em uma crítica da lista para visualizar e enviar mensagens."
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para Nova Crítica -->
    <v-dialog v-model="showNewCriticismDialog" max-width="500">
      <v-card>
        <v-card-title>Nova Observação</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="newCriticismDescription"
            label="Descrição da Observação"
            placeholder="Descreva a observação..."
            variant="outlined"
            rows="4"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <Button variant="text" @click="showNewCriticismDialog = false">
            Cancelar
          </Button>
          <Button
            color="primary"
            variant="text"
            :disabled="!newCriticismDescription.trim()"
            @click="createNewCriticism"
          >
            Criar
          </Button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para Editar Descrição -->
    <v-dialog v-model="showEditDescriptionDialog" max-width="500">
      <v-card>
        <v-card-title>Editar Observação</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="editDescription"
            label="Descrição da Observação"
            placeholder="Descreva a observação..."
            variant="outlined"
            rows="4"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <Button variant="text" @click="showEditDescriptionDialog = false">
            Cancelar
          </Button>
          <Button
            color="primary"
            variant="text"
            :disabled="!editDescription.trim()"
            @click="updateCriticismDescription"
          >
            Salvar
          </Button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </DialogForm>
</template>

<script setup lang="ts">
const props = defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

// Stores
const criticismStore = usePatientConsultationCriticismStore();
const auth = useAuthStore();

// Reactive data
const selectedCriticism = ref<PatientConsultationCriticismsProps | null>(null);
const newMessage = ref("");
const newCriticismDescription = ref("");
const editDescription = ref("");
const showNewCriticismDialog = ref(false);
const showEditDescriptionDialog = ref(false);
const chatContainer = ref<HTMLElement>();
const show = defineModel("show", {
  default: false,
});

const criticisms = computed(() => criticismStore.$all?.criticisms || []);
const $currentUser = computed(() => auth.$currentUser);

// Methods
const loadCriticisms = async () => {
  try {
    await criticismStore.listCriticisms(props.solicitation.id!);
  } catch (error) {
    console.error("Erro ao carregar críticas:", error);
  }
};

const selectCriticism = async (
  criticism: PatientConsultationCriticismsProps
) => {
  if (!criticism.id) return;

  try {
    await criticismStore.getCriticismDetails(criticism.id);
    selectedCriticism.value = criticismStore.$single?.criticism || criticism;
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Erro ao carregar detalhes da crítica:", error);
    selectedCriticism.value = criticism;
  }
};

const sendMessage = async () => {
  if (
    !newMessage.value.trim() ||
    !selectedCriticism.value?.id ||
    !$currentUser.value?.id
  )
    return;

  try {
    const messageData = {
      patientConsultationCriticismId: selectedCriticism.value.id,
      userId: $currentUser.value?.id,
      message: newMessage.value.trim(),
    };
    await criticismStore.addMessage(messageData);
    newMessage.value = "";

    // Recarregar detalhes da crítica para mostrar a nova mensagem
    await criticismStore.getCriticismDetails(selectedCriticism.value.id);
    selectedCriticism.value =
      criticismStore.$single?.criticism || selectedCriticism.value;

    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};

const createNewCriticism = async () => {
  if (!newCriticismDescription.value.trim()) return;

  try {
    await criticismStore.createCriticism({
      patientConsultationId: props.solicitation.id!,
      description: newCriticismDescription.value.trim(),
    });
    newCriticismDescription.value = "";
    showNewCriticismDialog.value = false;
    await loadCriticisms();
  } catch (error) {
    console.error("Erro ao criar crítica:", error);
  }
};

const editCriticismFromList = (
  criticism: PatientConsultationCriticismsProps
) => {
  selectedCriticism.value = criticism;
  editDescription.value = criticism.description || "";
  showEditDescriptionDialog.value = true;
};

const updateCriticismDescription = async () => {
  if (!editDescription.value.trim() || !selectedCriticism.value?.id) return;

  try {
    await criticismStore.updateCriticism({
      id: selectedCriticism.value.id,
      description: editDescription.value.trim(),
      status: selectedCriticism.value.status || "ABERTO",
    });

    // Atualizar a crítica selecionada
    selectedCriticism.value.description = editDescription.value.trim();

    editDescription.value = "";
    showEditDescriptionDialog.value = false;

    // Recarregar lista de críticas
    await loadCriticisms();
  } catch (error) {
    console.error("Erro ao atualizar descrição:", error);
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const formatDateTime = (date: string | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleString("pt-BR");
};

const getStatusColor = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "resolvido":
      return "success";
    case "em_andamento":
      return "warning";
    case "pendente":
    default:
      return "primary";
  }
};

// Watchers
watch(
  () => show.value,
  (newValue) => {
    if (newValue) {
      loadCriticisms();
    }
  }
);

watch(
  () => showEditDescriptionDialog.value,
  (newValue) => {
    if (newValue && selectedCriticism.value) {
      editDescription.value = selectedCriticism.value.description || "";
    }
  }
);
</script>

<style scoped>
.criticism-list {
  max-height: 70vh;
  overflow-y: auto;
}

.criticism-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* Estilos para o chat */
.messages-container {
  height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  max-height: 100%;
}

.criticisms-list {
  height: 500px;
  overflow-y: auto;
  padding: 8px;
}

.message-item {
  margin-bottom: 16px;
  display: flex;
}

.message-sent {
  justify-content: flex-end;
}

.message-received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message-sent .message-bubble {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  border-bottom-right-radius: 4px;
}

.message-received .message-bubble {
  background-color: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
  border-bottom-left-radius: 4px;
}

.message-content {
  word-wrap: break-word;
  line-height: 1.4;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.message-received .message-time {
  text-align: left;
}

.cursor-pointer {
  cursor: pointer;
}

/* Responsividade */
@media (max-width: 960px) {
  .messages-container {
    height: 300px;
  }

  .criticisms-list {
    height: 300px;
  }

  .criticism-list {
    max-height: 40vh;
  }
}

@media (max-width: 600px) {
  .messages-container {
    height: 250px;
  }

  .criticisms-list {
    height: 200px;
  }

  .message-bubble {
    max-width: 85%;
  }

  .criticism-list {
    max-height: 35vh;
  }
}
</style>
