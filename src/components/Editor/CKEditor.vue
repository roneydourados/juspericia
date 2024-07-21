<template>
  <ckeditor
    :editor="editor"
    v-model="value"
    :config="config"
    @blur="handleBlur"
    @input="handleChange"
  ></ckeditor>
</template>

<script setup lang="ts">
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

// import coreTranslations from "ckeditor5/translations/pl.js";

import { useField } from "vee-validate";
import { v4 as uuidv4 } from "uuid";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);

const editor = ref(ClassicEditor);

const config = reactive({
  toolbar: ["heading", "|", "bold", "italic"],
});

const editorConfig = ref({
  menubar: {
    isVisible: true,
  },
  language: {
    ui: "pt",
    content: "pt",
  },
  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  toolbar: {
    items: [
      "bold",
      "italic",
      "|",
      "undo",
      "redo",
      "-",
      "numberedList",
      "bulletedList",
    ],

    shouldNotGroupWhenFull: true,
  },
  licenseKey:
    "bC93YTBlWG9XMFV1dlJxRVBTM2V0MWdMMXBmYndyOWMwOWZBMnJuUVV6OWhxRWRURHZCY0gvQ1VqQzB6ZXc9PS1NakF5TkRBNE1qQT0=",
  mention: {
    // Mention configuration
  },
});

const fieldName = computed<MaybeRef>(() => {
  return uuidv4();
});

const validationRules = computed<MaybeRef>(() => {
  return toTypedSchema(zod.string().nullish().optional());
});

const { value, handleBlur, handleChange } = useField<string>(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script>
