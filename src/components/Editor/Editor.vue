<template>
  <v-card v-if="editor">
    <v-row dense class="pa-4">
      <v-col cols="12" lg="3">
        <v-btn-toggle variant="outlined" divided>
          <v-btn
            size="small"
            icon="mdi-format-bold"
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
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
          <v-btn
            size="small"
            icon="mdi-format-header-1"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          />
          <v-btn
            size="small"
            icon="mdi-format-header-2"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          />
          <v-btn
            size="small"
            icon="mdi-format-header-3"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          />
        </v-btn-toggle>
      </v-col>

      <v-col cols="12" lg="9" class="d-flex" style="gap: 1rem">
        <StringInput label="Nome do laudo" />
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-check"
          >Salvar</v-btn
        >
      </v-col>
    </v-row>
    <v-card-text>
      <v-card variant="flat" class="pa-4 border-thin">
        <div class="container">
          <TiptapEditorContent :editor="editor" style="min-height: 40rem" />
        </div>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { content } from "./content";

const editor = useEditor({
  content,
  editorProps: {
    attributes: {
      spellcheck: "false",
    },
  },
  extensions: [
    TiptapStarterKit,
    Highlight,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ],
});

onBeforeUnmount(() => {
  //@ts-ignore
  unref(editor).destroy();
});
</script>

<style lang="scss">
.container {
  height: 36rem;
  overflow-y: scroll;
}
.tiptap {
  min-height: 20rem !important;
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
</style>
