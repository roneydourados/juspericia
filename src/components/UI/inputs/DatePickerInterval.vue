<template>
  <div>
    <v-text-field
      v-model="dateInterval"
      variant="outlined"
      density="compact"
      base-color="primary"
      color="primary"
      :label="label"
      :error-messages="errorMessage"
      :clearable="clearable"
      :disabled="disabled"
      readonly
      persistent-clear
      persistent-hint
      @click:clear="clear"
      @update:model-value="handleUpdateModelPincipal"
    >
      <template v-slot:prepend-inner>
        <v-menu v-model="menu" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              icon
              size="x-small"
              v-bind="props"
              @click="handleClickMenu"
            >
              <v-icon icon="mdi-calendar-multiselect-outline" size="20" />
            </v-btn>
          </template>
          <Card :actions="true">
            <template #content>
              <v-row dense>
                <v-col cols="6">
                  <v-date-picker
                    rounded="lg"
                    hide-actions
                    hide-header
                    v-model="date"
                    color="primary"
                    :elevation="8"
                    @update:model-value="sendValue"
                  />
                </v-col>
                <v-col cols="6">
                  <v-date-picker
                    rounded="lg"
                    hide-actions
                    hide-header
                    v-model="date"
                    color="primary"
                    :elevation="8"
                    @update:model-value="sendValue"
                  />
                </v-col>
              </v-row>
            </template>
            <template #actions>
              <v-spacer></v-spacer>
              <div class="d-flex align-center pa-4" style="gap: 1rem">
                <ButtonPrimary @click="sendValue">Ok</ButtonPrimary>
                <ButtonError @click="menu = false">Cancelar</ButtonError>
              </div>
            </template>
          </Card>
        </v-menu>
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";

import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useField } from "vee-validate";
import { textRequired } from "../utils";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },

  required: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "update:modelDate"]);

const date = ref();
const modelDate = ref("");
const menu = ref(false);
const dateInterval = ref("");
const fieldName = computed<MaybeRef>(() => {
  return props.label;
});

const validationRules = computed<MaybeRef>(() => {
  if (props.required) {
    return toTypedSchema(
      zod
        .string({
          invalid_type_error: "Data inválida",
          required_error: textRequired,
        })
        //.min(10, "Data inválida")
        .refine((val) => {
          if (val) {
            const date = new Date(
              moment(val, "DD/MM/YYYY").get("year"),
              moment(val, "DD/MM/YYYY").get("month"),
              moment(val, "DD/MM/YYYY").get("date")
            );
            const isValid = moment(date, true).isValid();

            return isValid;
          }
          return "Data inválida";
        })
    );
  }

  return toTypedSchema(
    zod
      .string({
        invalid_type_error: "Data inválida",
      })
      //.min(10, "Data inválida")
      .optional()
      .nullish()
      .refine((val) => {
        if (val) {
          const date = new Date(
            moment(val, "DD/MM/YYYY").get("year"),
            moment(val, "DD/MM/YYYY").get("month"),
            moment(val, "DD/MM/YYYY").get("date")
          );
          const isValid = moment(date, true).isValid();

          return isValid;
        }
        return "Data inválida";
      })
  );
});

const { value, errorMessage /*, handleBlur, handleChange*/ } = useField<
  string | null
>(fieldName, validationRules, {
  syncVModel: true,
});

const clear = () => {
  date.value = null;
  value.value = null;
  modelDate.value = "";
};

onMounted(() => {
  sendValue();
});

const sendValue = () => {
  menu.value = false;

  if (date.value && moment(date.value, true).isValid()) {
    value.value = moment(date.value, true).format("DD/MM/YYYY");
    modelDate.value = moment(date.value, true).format("YYYY-MM-DD");
  } else if (value.value) {
    if (value.value.length === 8 || value.value.length === 10) {
      if (moment(value.value, "DDMMYYYY", true).isValid()) {
        modelDate.value = moment(value.value, "DDMMYYYY").format("YYYY-MM-DD");
        value.value = moment(value.value, "DDMMYYYY").format("DD/MM/YYYY");
      } else if (moment(value.value, "YYYY-MM-DD", true).isValid()) {
        modelDate.value = moment(value.value, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
        value.value = moment(value.value, "YYYY-MM-DD").format("DD/MM/YYYY");
      }
    }
  } else {
    modelDate.value = "";
    date.value = null;
  }

  emit("update:modelValue", value.value);
  emit("update:modelDate", modelDate.value);

  if (
    modelDate.value &&
    moment(modelDate.value).isValid() &&
    date.value === null
  ) {
    date.value = new Date(
      moment(modelDate.value).get("year"),
      moment(modelDate.value).get("month"),
      moment(modelDate.value).get("date")
    );
  }

  if (value.value) {
    dateInterval.value = value.value;
  }
};

const handleUpdateModelPincipal = () => {
  //menu.value = false;
  if (value.value) {
    if (value.value.length === 8 || value.value.length === 10) {
      sendValue();
    } else {
      modelDate.value = "";
      date.value = null;
      if (value.value === "") {
        value.value = null;
      }
      emit("update:modelValue", value.value);
      emit("update:modelDate", "");
    }
  } else {
    modelDate.value = "";
    date.value = null;
    if (value.value === "") {
      value.value = null;
    }
    emit("update:modelValue", value.value);
    emit("update:modelDate", "");
  }
};

const handleClickMenu = () => {
  if (modelDate.value && moment(modelDate.value).isValid()) {
    date.value = new Date(
      moment(modelDate.value).get("year"),
      moment(modelDate.value).get("month"),
      moment(modelDate.value).get("date")
    );
  }
};
</script>
