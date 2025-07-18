<template>
  <SelectInput
    :label="label"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :items="states"
    :icon="icon"
    item-title="code"
    item-value="code"
    :clearable="true"
    v-model="value"
  >
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :title="String((item as any).raw.code)"
        density="compact"
      />
    </template>

    <template #item-selection="{ item }">
      <div class="d-flex align-center">
        {{ (item as any).raw.code }}
      </div>
    </template>
  </SelectInput>
</template>

<script setup lang="ts">
import { getStates } from "@brazilian-utils/brazilian-utils";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: "UF",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const states = ref(getStates());

const value = ref(props.modelValue);

watchEffect(() => {
  value.value = props.modelValue;
  emit("update:modelValue", value);
});

// watch(
//   () => value,
//   (newValue) => {
//     emit("update:modelValue", newValue);
//   }
// );
</script>
