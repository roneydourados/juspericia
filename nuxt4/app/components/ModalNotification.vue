<template>
  <div v-if="item.props?.isModal" style="display: none">
    <v-dialog
      v-model="dialogVisible"
      persistent
      :max-width="mobile ? '' : '500'"
      @keydown.esc="handleEscapeKey"
    >
      <v-card flat rounded="xl" style="border-top: 6px solid #c7d82f">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="d-flex">
            <v-icon icon="mdi-alert-outline" color="error" start />
            <div :id="titleId" class="font-weight-bold text-primary">
              {{ item.title }}
            </div>
          </div>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="handleClose"
            aria-label="Fechar modal"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <div class="px-2">
          <v-divider />
        </div>
        <v-card-text>
          <p :id="messageId" class="mb-0">
            {{ item.message }}
          </p>
        </v-card-text>
        <v-card-actions v-if="!item.props?.actions" class="justify-end px-4">
          <Button
            variant="outlined"
            @click="handleClose"
            color="grey"
            size="small"
          >
            <span class="text-caption text-primary">
              <v-icon icon="mdi-close" color="colorIcon" start />
              Fechar
            </span>
          </Button>
        </v-card-actions>
        <v-card-actions v-else-if="item.props?.actions" class="justify-end">
          <Button
            v-for="(action, index) in item.props.actions"
            :key="index"
            @click="handleAction(action)"
            :color="getButtonColor(action.variant)"
            variant="outlined"
            :type="action.type || 'button'"
            size="small"
            class="text-none"
          >
            <span style="font-size: 0.7rem; font-weight: 700">
              {{ action.label }}
            </span>
          </Button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <Notification v-else :item="item" />
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// Controle de visibilidade do dialog
const dialogVisible = ref(false);

// IDs únicos para acessibilidade
const titleId = computed(() => `modal-title-${props.item.id || Date.now()}`);
const messageId = computed(
  () => `modal-message-${props.item.id || Date.now()}`
);

// Observa quando o item é modal para mostrar o dialog
watch(
  () => props.item.props?.isModal,
  (isModal) => {
    if (isModal) {
      dialogVisible.value = true;
    }
  },
  { immediate: true }
);

const handleClose = () => {
  dialogVisible.value = false;
  props.item.clear();
};

const handleEscapeKey = () => {
  if (!props.item.props?.preventEscapeClose) {
    handleClose();
  }
};

const handleAction = (action) => {
  if (action.handler && typeof action.handler === "function") {
    action.handler(props.item);
  }

  if (!action.keepOpen) {
    handleClose();
  }
};

const getButtonColor = (variant) => {
  switch (variant) {
    case "primary":
      return "primary";
    case "success":
      return "success";
    case "error":
      return "error";
    case "secondary":
    default:
      return "grey";
  }
};

const getButtonVariant = (variant) => {
  switch (variant) {
    case "primary":
    case "danger":
    case "success":
      return "flat";
    case "secondary":
    default:
      return "outlined";
  }
};
</script>
