<template>
  <v-select
    v-model="value"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :error-messages="errorMessage"
    :items="items"
    variant="outlined"
    density="compact"
    base-color="primary"
    color="primary"
    :item-title="itemTitle"
    :item-value="itemValue"
    :return-object="returnObject"
    :prepend-inner-icon="icon"
    :readonly="readonly"
    :clearable="clearable"
    @blur="handleBlur"
    @input="handleChange"
    @update:modelValue="$emit('update:modelValue')"
  >
    <template v-slot:item="{ props, item }">
      <slot name="items" :props="props" :item="item" />
    </template>

    <template v-slot:prepend-item>
      <slot name="prepend-item" />
    </template>

    <template v-slot:append-item>
      <slot name="append-item" />
    </template>

    <template v-slot:selection="{ item }">
      <slot name="item-selection" :props="props" :item="item" />
    </template>
  </v-select>
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
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
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
});

defineEmits(["update:modelValue"]);

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
          .refine((value) => Object.keys(value).length > 0, {
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

const { value, errorMessage, handleBlur, handleChange } = useField(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script>
