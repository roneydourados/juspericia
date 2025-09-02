<template>
  <v-card v-if="editor" elevation="0">
    <bubble-menu
      class="d-flex align-center"
      style="gap: 0.5rem"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <v-card flat rounded="lg">
        <v-btn-toggle variant="outlined">
          <v-btn
            size="small"
            icon="mdi-format-bold"
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
          />
          <v-btn
            size="small"
            icon="mdi-format-italic"
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
          />
          <v-btn
            size="small"
            icon="mdi-format-strikethrough"
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
          />
        </v-btn-toggle>
      </v-card>
    </bubble-menu>
    <v-row class="pa-2">
      <v-col cols="12">
        <v-btn-toggle variant="outlined" divided>
          <v-btn
            size="small"
            icon="mdi-format-bold"
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :color="editor.isActive('bold') ? 'blue' : ''"
          />
          <v-btn
            size="small"
            icon="mdi-format-italic"
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          />
          <v-btn
            size="small"
            icon="mdi-format-align-left"
            @click="editor.chain().focus().setTextAlign('left').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          />
          <v-btn
            size="small"
            icon="mdi-format-align-center"
            @click="editor.chain().focus().setTextAlign('center').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          />
          <v-btn
            size="small"
            icon="mdi-format-align-right"
            @click="editor.chain().focus().setTextAlign('right').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          />
          <v-btn
            size="small"
            icon="mdi-format-align-justify"
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          />
        </v-btn-toggle>
      </v-col>
      <v-col cols="12">
        <v-card variant="flat" class="pa-0 border-thin" rounded="lg">
          <div :style="{ height: `${height}rem`, 'overflow-y': 'scroll' }">
            <EditorContent :editor="editor" class="pa-2" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  height: {
    type: String,
    default: "20",
  },
});

const emit = defineEmits(["update:modelValue"]);
const editor = ref();

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue,
    extensions: [
      Document,
      Paragraph,
      Text,
      StarterKit,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    onUpdate: () => {
      emit("update:modelValue", editor.value.getHTML());
    },
  });
});

onBeforeUnmount(() => {
  editor.value.destroy();
});

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value?.getHTML() === value;

    if (isSame) {
      return;
    }

    editor.value?.commands.setContent(value, false);
  }
);
</script>

<style lang="scss">
.tiptap {
  height: 100vh !important;
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: rgb(var(--v-theme-purple-lighten-3)) !important;
    border-radius: 0.4rem;
    color: rgb(var(--v-theme-black)) !important;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: rgb(var(--v-theme-black)) !important;
    border-radius: 0.5rem;
    color: rgb(var(--v-theme-white)) !important;
    font-family: "Roboto", monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  mark {
    background-color: #faf594;
    border-radius: 0.4rem;
    box-decoration-break: clone;
    padding: 0.1rem 0.3rem;
  }

  blockquote {
    border-left: 3px solid rgb(var(--v-theme-grey-lighten-3)) !important;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid rgb(var(--v-theme-grey-lighten-2)) !important;
    margin: 2rem 0;
  }
}
.tiptap:focus {
  outline: none;
}

.tiptap:focus {
  outline: none;
  /*background-color: #f0f0f0; */
}
</style>
