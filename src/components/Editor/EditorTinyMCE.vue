<template>
  <Editor
    v-model="value"
    :api-key="apikey"
    :init="init"
    style="min-height: 40rem"
    @blur="handleBlur"
    @input="handleChange"
  />
</template>

<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";
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

const apikey = ref("fjw139997qqks1c2efp4ufu56j2ce069fy6kw8ayq94wtzt4");

const init = ref({
  toolbar_mode: "sliding",
  plugins:
    "anchor autolink charmap codesample image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate tableofcontents footnotes mergetags autocorrect typography inlinecss",
  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
  tinycomments_mode: "embedded",
  tinycomments_author: "Author name",
  mergetags_list: [
    { value: "First.Name", title: "First Name" },
    { value: "Email", title: "Email" },
  ],
  language: "pt_BR",
  menu: {
    file: {
      title: "File",
      items:
        "newdocument restoredraft | preview | importword exportpdf exportword | print",
    },
    edit: {
      title: "Edit",
      items: "undo redo | cut copy paste pastetext | selectall | searchreplace",
    },
    view: {
      title: "View",
      items:
        "code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen",
    },
    insert: {
      title: "Insert",
      items:
        "image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime",
    },
    format: {
      title: "Format",
      items:
        "bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat",
    },
    tools: {
      title: "Tools",
      items: "spellchecker spellcheckerlanguage | a11ycheck code wordcount",
    },
    table: {
      title: "Table",
      items:
        "inserttable | cell row column | advtablesort | tableprops deletetable",
    },
    help: { title: "Help", items: "help" },
  },
});

const fieldName = computed<MaybeRef>(() => {
  return uuidv4();
});

const validationRules = computed<MaybeRef>(() => {
  return toTypedSchema(zod.string().nullish().optional());
});

const { value, handleBlur, handleChange } = useField(
  fieldName,
  validationRules,
  {
    syncVModel: true,
  }
);
</script>
