<template>
  <DialogForm title="" :show="show" fullscreen @dialog="show = false">
    <v-tabs v-model="activeTab" color="primary" align-tabs="center">
      <v-tab value="criticisms" class="text-none">
        <v-icon icon="mdi-comment-alert-outline" start />
        Lista de Críticas
      </v-tab>
      <v-tab value="messages" :disabled="!selectedCriticism" class="text-none">
        <v-icon icon="mdi-chat-outline" start />
        Mensagens
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab" class="mt-4">
      <!-- Tab 1: Lista de Críticas -->
      <v-tabs-window-item value="criticisms">
        <v-row dense>
          <v-col cols="12">
            <v-card flat>
              <div class="d-flex justify-space-between align-center w-100">
                <strong style="font-size: 1.2rem"
                  >Críticas da Solicitação</strong
                >
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  @click="showNewCriticismDialog = true"
                >
                  <v-icon icon="mdi-plus" start />
                  Nova Crítica
                </Button>
              </div>

              <v-card-text>
                <v-list
                  v-if="criticisms?.length"
                  lines="three"
                  variant="tonal"
                  rounded="xl"
                >
                  <v-list-item
                    v-for="criticism in criticisms"
                    :key="criticism.id"
                    @click="selectCriticism(criticism)"
                    class="cursor-pointer"
                    :class="{
                      'bg-primary-lighten-5':
                        selectedCriticism?.id === criticism.id,
                    }"
                  >
                    <template #prepend>
                      <v-avatar color="primary" size="40">
                        <v-icon icon="mdi-comment-alert" />
                      </v-avatar>
                    </template>
                    <v-list-item-title>
                      {{ criticism.description || "Sem descrição" }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Criado em: {{ formatDate(criticism.createdAt) }}
                      <v-chip
                        :color="getStatusColor(criticism.status)"
                        size="small"
                        class="ml-2"
                      >
                        {{ criticism.status || "Pendente" }}
                      </v-chip>
                    </v-list-item-subtitle>
                    <template #append>
                      <v-badge
                        v-if="criticism.messages?.length"
                        :content="criticism.messages.length"
                        color="primary"
                      >
                        <v-icon icon="mdi-message" />
                      </v-badge>
                      <v-icon icon="mdi-chevron-right" />
                    </template>
                  </v-list-item>
                </v-list>
                <v-empty-state
                  v-else
                  icon="mdi-comment-alert-outline"
                  title="Nenhuma crítica encontrada"
                  text="Não há críticas para esta solicitação."
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <!-- Tab 2: Chat de Mensagens -->
      <v-tabs-window-item value="messages">
        <v-row v-if="selectedCriticism">
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex justify-between align-center">
                <div>
                  <span>Mensagens da Crítica</span>
                  <v-chip color="primary" size="small" class="ml-2">
                    {{ selectedCriticism.status || "Pendente" }}
                  </v-chip>
                </div>
                <v-btn
                  color="secondary"
                  variant="outlined"
                  size="small"
                  @click="showEditDescriptionDialog = true"
                >
                  <v-icon icon="mdi-pencil" start />
                  Editar Descrição
                </v-btn>
              </v-card-title>
              <v-card-subtitle v-if="selectedCriticism.description">
                <strong>Descrição:</strong> {{ selectedCriticism.description }}
              </v-card-subtitle>

              <!-- Chat Container -->
              <v-card-text class="pa-0">
                <div class="chat-container" ref="chatContainer">
                  <div
                    v-if="selectedCriticism.messages?.length"
                    class="messages-list"
                  >
                    <div
                      v-for="message in selectedCriticism.messages"
                      :key="message.id"
                      :class="[
                        'message-item',
                        message.userId === currentUserId
                          ? 'message-sent'
                          : 'message-received',
                      ]"
                    >
                      <div class="message-bubble">
                        <div class="message-content">{{ message.message }}</div>
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
              <v-card-actions class="pa-4">
                <v-text-field
                  v-model="newMessage"
                  placeholder="Digite sua mensagem..."
                  variant="outlined"
                  density="compact"
                  hide-details
                  @keyup.enter="sendMessage"
                  class="flex-grow-1"
                >
                  <template #append-inner>
                    <v-btn
                      icon="mdi-send"
                      color="primary"
                      variant="text"
                      size="small"
                      :disabled="!newMessage.trim()"
                      @click="sendMessage"
                    />
                  </template>
                </v-text-field>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>

    <!-- Dialog para Nova Crítica -->
    <v-dialog v-model="showNewCriticismDialog" max-width="500">
      <v-card>
        <v-card-title>Nova Crítica</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="newCriticismDescription"
            label="Descrição da crítica"
            placeholder="Descreva a crítica..."
            variant="outlined"
            rows="4"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showNewCriticismDialog = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            :disabled="!newCriticismDescription.trim()"
            @click="createNewCriticism"
          >
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para Editar Descrição -->
    <v-dialog v-model="showEditDescriptionDialog" max-width="500">
      <v-card>
        <v-card-title>Editar Descrição da Crítica</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="editDescription"
            label="Descrição da crítica"
            placeholder="Descreva a crítica..."
            variant="outlined"
            rows="4"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showEditDescriptionDialog = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            :disabled="!editDescription.trim()"
            @click="updateCriticismDescription"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

const criticismStore = usePatientConsultationCriticismStore();
const authStore = useAuthStore();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

// Estados reativos
const activeTab = ref("criticisms");
const selectedCriticism = ref<PatientConsultationCriticismsProps | null>(null);
const criticisms = ref<PatientConsultationCriticismsProps[]>([]);
const newMessage = ref("");
const newCriticismDescription = ref("");
const editDescription = ref("");
const showNewCriticismDialog = ref(false);
const showEditDescriptionDialog = ref(false);
const chatContainer = ref<HTMLElement>();

// Computed
const currentUserId = computed(() => authStore.$currentUser?.id);

// Watchers
watch(
  () => props.solicitation,
  async (newSolicitation) => {
    if (newSolicitation?.id) {
      await loadCriticisms();
    }
  },
  { immediate: true }
);

watch(
  () => show.value,
  (isVisible) => {
    if (isVisible && props.solicitation?.id) {
      loadCriticisms();
    }
  }
);

watch(
  () => selectedCriticism.value,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  }
);

// Métodos
const loadCriticisms = async () => {
  if (!props.solicitation?.id) return;

  try {
    await criticismStore.listCriticisms(props.solicitation.id);
    criticisms.value = criticismStore.$all?.criticisms || [];
  } catch (error) {
    console.error("Erro ao carregar críticas:", error);
  }
};

const selectCriticism = async (
  criticism: PatientConsultationCriticismsProps
) => {
  selectedCriticism.value = criticism;
  activeTab.value = "messages";

  // Carregar detalhes da crítica com mensagens
  if (criticism.id) {
    try {
      await criticismStore.getCriticismDetails(criticism.id);
      const criticismDetails = criticismStore.$single?.criticism;
      if (criticismDetails) {
        selectedCriticism.value = criticismDetails;
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes da crítica:", error);
    }
  }
};

const sendMessage = async () => {
  if (
    !newMessage.value.trim() ||
    !selectedCriticism.value?.id ||
    !currentUserId.value
  )
    return;

  try {
    await criticismStore.addMessage({
      patientConsultationCriticismId: selectedCriticism.value.id,
      userId: currentUserId.value,
      message: newMessage.value.trim(),
    });

    // Recarregar detalhes da crítica para atualizar mensagens
    await criticismStore.getCriticismDetails(selectedCriticism.value.id);
    const criticismDetails = criticismStore.$single?.criticism;
    if (criticismDetails) {
      selectedCriticism.value = criticismDetails;
    }

    newMessage.value = "";
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};

const createNewCriticism = async () => {
  if (!newCriticismDescription.value.trim() || !props.solicitation?.id) return;

  try {
    await criticismStore.createCriticism({
      patientConsultationId: props.solicitation.id,
      description: newCriticismDescription.value.trim(),
    });

    // Recarregar lista de críticas
    await loadCriticisms();

    newCriticismDescription.value = "";
    showNewCriticismDialog.value = false;
  } catch (error) {
    console.error("Erro ao criar crítica:", error);
  }
};

const updateCriticismDescription = async () => {
  if (!editDescription.value.trim() || !selectedCriticism.value?.id) return;

  try {
    // Assumindo que existe um método para atualizar a descrição
    // Se não existir, você pode precisar criar no store
    await criticismStore.updateCriticismStatus({
      id: selectedCriticism.value.id,
      patientConsultationId: selectedCriticism.value.patientConsultationId,
      description: editDescription.value.trim(),
      status: selectedCriticism.value.status,
    });

    // Recarregar detalhes
    await criticismStore.getCriticismDetails(selectedCriticism.value.id);
    const criticismDetails = criticismStore.$single?.criticism;
    if (criticismDetails) {
      selectedCriticism.value = criticismDetails;
    }

    // Recarregar lista
    await loadCriticisms();

    showEditDescriptionDialog.value = false;
  } catch (error) {
    console.error("Erro ao atualizar descrição:", error);
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const formatDate = (date: string | undefined) => {
  if (!date) return "Data não disponível";
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

const formatDateTime = (date: string | undefined) => {
  if (!date) return "";
  return dayjs(date).format("DD/MM HH:mm");
};

const getStatusColor = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "resolvido":
      return "success";
    case "em_andamento":
      return "warning";
    case "pendente":
    default:
      return "error";
  }
};

// Preparar dados para edição
watch(
  () => showEditDescriptionDialog.value,
  (isVisible) => {
    if (isVisible && selectedCriticism.value) {
      editDescription.value = selectedCriticism.value.description || "";
    }
  }
);
</script>

<style scoped>
.chat-container {
  height: 400px;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  width: 100%;
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
  word-wrap: break-word;
}

.message-sent .message-bubble {
  background-color: #1976d2;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-received .message-bubble {
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message-content {
  margin-bottom: 4px;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
