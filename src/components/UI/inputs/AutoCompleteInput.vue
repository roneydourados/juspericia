<template>
  <v-autocomplete
    ref="autocomplete"
    v-model:model-value="value"
    :item-title="itemTitle"
    :item-value="itemValue"
    :label="dynamicLabel"
    :items="items"
    variant="outlined"
    density="compact"
    :prepend-inner-icon="icon"
    hide-no-data
    base-color="primary"
    color="primary"
    :chips="chips"
    :return-object="returnObject"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :loading="loading"
    :error-messages="errorMessage"
    @update:model-value="handleComplet"
    @keydown.enter="handleComplet"
  >
    <template v-slot:item="{ props, item }">
      <slot name="items" :props="props" :item="item" />
    </template>

    <template v-slot:selection="{ item }">
      <slot name="selection" :item="item" />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";

import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

import { textRequired } from "../utils";

const props = defineProps({
  itemTitle: {
    type: String,
    default: "",
  },
  itemValue: {
    type: String,
    default: "",
  },
  returnObject: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array as PropType<Array<any>>,
    required: true,
  },
  modelValue: {
    type: [Object, String, Number],
    default: null,
  },
  icon: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  chips: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  // name: {
  //   type: String,
  //   required: true,
  // },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

const autocomplete = ref();
const nextField = ref<HTMLDivElement | null>(null);

const fieldName = computed<MaybeRef>(() => {
  return props.label;
});

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    if (props.returnObject) {
      return toTypedSchema(
        zod
          .object(
            {},
            {
              invalid_type_error: textRequired,
              required_error: textRequired,
            }
          )
          .required({})
          .refine((value) => Object.keys(value).length <= 0, {
            message: textRequired,
          })
      );
    }

    return toTypedSchema(
      zod
        .string({
          invalid_type_error: textRequired,
        })
        .min(1, { message: textRequired })
        .or(zod.number().min(1, { message: textRequired }))
    );
  }

  if (props.returnObject) {
    return toTypedSchema(zod.object({}).nullish().optional());
  }

  return toTypedSchema(zod.string().nullish().optional().or(zod.number()));
});

const { value, errorMessage } = useField<string | object | number>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);

const handleComplet = () => {
  emit("update:modelValue", value.value);
  // Fecha o menu do autocomplete
  autocomplete.value?.blur();
  // Define o foco no próximo campo
  nextField.value?.focus();
};
</script>
