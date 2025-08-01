<template>
  <v-select
    v-model="model"
    :label="dynamicLabel"
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
  >
    <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
      <slot v-if="slotProps" :name="name" v-bind="slotProps" />
      <slot v-else :name="name" v-bind="slotProps" />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

import { textRequired } from "../utils";
import { uuidv7 as uuid } from "uuidv7";

// Define props
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
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
});

// Use defineModel instead of modelValue + emit
const model = defineModel<any>();

// Computed label with asterisk if required
const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);
const fieldName = uuid(); // Unique field name for VeeValidate
// // Field name (used as key in form)
// const fieldName = computed<MaybeRef>(() => {
//   return props.label;
// });

// Validation rules based on props
const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    if (props.returnObject) {
      return toTypedSchema(
        zod
          .object(
            {},
            {
              error: textRequired,
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
          error: textRequired,
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

// Use VeeValidate field and sync with model
const { errorMessage, handleBlur, handleChange } = useField(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script>

<!-- <template>
  <v-select
    v-model="value"
    :label="dynamicLabel"
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
    <template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
      <slot v-if="slotProps" :name="name" v-bind="slotProps" />
      <slot v-else :name="name" v-bind="slotProps" />
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

const dynamicLabel = computed(() =>
  props.required ? props.label + "*" : props.label
);

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
</script> -->
