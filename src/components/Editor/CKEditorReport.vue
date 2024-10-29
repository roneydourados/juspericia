<template>
  <ckeditor
    v-model="value"
    tag-name="textarea"
    :editor="Editor"
    :config="config"
    @ready="onReady"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
    @destroy="onDestroy"
    style="height: 40rem"
  />
</template>

<script setup lang="ts">
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Undo,
  Alignment,
  EventInfo,
} from "ckeditor5";

import coreTranslations from "ckeditor5/translations/pt.js";
import "ckeditor5/ckeditor5.css";

import { useField } from "vee-validate";
import { uuidv7 } from "uuidv7";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

class Editor extends ClassicEditor {
  static override builtinPlugins = [
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Undo,
    Alignment,
  ];
}

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);

const editorInstance = ref<Editor | null>(null);

const config = reactive({
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "|",
    "undo",
    "|",
    "numberedList",
    "alignment",
  ],
  translations: [coreTranslations],
});

const fieldName = computed<MaybeRef>(() => {
  return uuidv7();
});

const validationRules = computed<MaybeRef>(() => {
  return toTypedSchema(zod.string().nullish().optional());
});

const { value } = useField<string>(fieldName, validationRules, {
  syncVModel: true,
});

const onReady = (editor: Editor) => {
  editorInstance.value = editor;

  //console.log("Editor is ready.", { editor });
};

const onFocus = (event: EventInfo, editor: Editor) => {
  //console.log("Editor focused.", { event, editor });
};

const onBlur = (event: EventInfo, editor: Editor) => {
  //console.log("Editor blurred.", { event, editor });
};

const onInput = (data: string, event: EventInfo, editor: Editor) => {
  //console.log("Editor data input.", { event, editor, data });
};

const onDestroy = () => {
  //console.log("Editor destroyed.");
};
</script>

<style>
.ck-editor__editable_inline {
  height: 40dvh; /* Define a altura mínima para 400 pixels */
}
</style>
