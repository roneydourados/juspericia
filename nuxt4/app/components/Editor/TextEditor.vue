<template>
  <div
    v-if="editor"
    :class="{ 'tiptap-dark-mode': $currentTheme === 'mainThemeDark' }"
  >
    <v-row dense class="mb-2">
      <v-col cols="12" class="d-flex flex-wrap" style="gap: 0.2rem">
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :color="`${editor.isActive('bold') ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-bold" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Negrito
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :color="`${editor.isActive('italic') ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-italic" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Itálico
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().setTextAlign('left').run()"
          :color="`${editor.isActive('left') ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-align-left" size="16" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Alinhar à esquerda
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().setTextAlign('right').run()"
          :color="`${editor.isActive('right') ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-align-right" size="16" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Alinhar à direita
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().setTextAlign('center').run()"
          :color="`${editor.isActive('center') ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-align-center" size="16" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Alinhar ao centro
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().setTextAlign('justify').run()"
          :color="`${editor.isActive('justify') ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-align-justify" size="16" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Justificar
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().setParagraph().run()"
          :color="`${editor.isActive('paragraph') ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-paragraph" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Parágrafo
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :color="`${editor.isActive('heading', { level: 1 }) ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-header-1" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Formatar título tamanho H1
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :color="`${editor.isActive('heading', { level: 2 }) ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-header-2" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Formatar título tamanho H2
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :color="`${editor.isActive('heading', { level: 3 }) ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-header-3" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Formatar título tamanho H3
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :color="`${editor.isActive('heading', { level: 4 }) ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-header-4" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Formatar título tamanho H4
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :color="`${editor.isActive('heading', { level: 5 }) ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-header-5" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Formatar título tamanho H5
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :color="`${editor.isActive('heading', { level: 6 }) ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-format-header-6" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Formatar título tamanho H6
          </v-tooltip>
        </v-btn>
        <v-btn
          variant="tonal"
          size="x-small"
          icon
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :color="`${editor.isActive('codeBlock') ? 'darkText' : $currentTheme === 'mainThemeDark' ? 'white' : 'primary'}`"
        >
          <v-icon icon="mdi-code-block-parentheses" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Estilizar com bloco de código
          </v-tooltip>
        </v-btn>

        <TextEditorColorMenu
          @update:modelValue="editor.chain().focus().setColor($event).run()"
        />
        <v-btn
          color="primary"
          variant="tonal"
          size="x-small"
          icon
          @click="handleUploadImage"
        >
          <v-icon icon="mdi-image-outline" size="15" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Enviar Imagem
          </v-tooltip>
        </v-btn>
        <TextEditorFontFamilly
          class="ml-2"
          @update:modelValue="
            editor.chain().focus().setFontFamily($event).run()
          "
        />
      </v-col>

      <v-col cols="12">
        <v-card variant="flat" class="pa-0 border-thin">
          <div
            :style="{ height: `${height}rem`, 'overflow-y': 'scroll' }"
            :class="{ 'editor-dark': $currentTheme === 'mainThemeDark' }"
          >
            <EditorContent :editor="editor" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
//********IMPORTS*********
//Importações: insira aqui as importações de componentes, bibliotecas e etc.
//Ex. import { ref, computed, watch, onMounted } from 'myImports'
import { TextAlign } from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import { Color, TextStyle, FontFamily } from "@tiptap/extension-text-style";
import HardBreak from "@tiptap/extension-hard-break";
import Gapcursor from "@tiptap/extension-gapcursor";
//********IMPORTS*********

//********COMPOSABLES*********
//Composables: insira aqui os composables que serão utilizados no componente.
//Ex. import { useStore } from 'useMyComposable'
//********COMPOSABLES*********

//********PROPS*********
//Props: insira aqui as props do componente.
//Ex. defineProps({ title: { type: String, required: true } })
const props = defineProps({
  height: {
    type: String,
    default: "20",
  },
});
//********PROPS*********

//********EMITS*********
//Emits: insira aqui os emits do componente.
//Ex. const emits = defineEmits(['increment'])
const emit = defineEmits(["update:modelValue"]);
//********EMITS*********

const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

//********VARIAVEIS*********
//Variáveis reativas: insira aqui as variáveis reativas do componente.
//Ex. const count = ref(0)
const editor = ref();
const editorContent = defineModel({
  default: "",
});
//********VARIAVEIS*********

//********WATCHS*********
//Watches: insira aqui os watches do componente.
//Ex. watch(count, (newValue, oldValue) => { console.log(newValue, oldValue) })
watch(editorContent, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue);
  }
});
//********WATCHS*********

//********COMPUTEDS*********
//Computed: insira aqui os computeds do componente.
//Ex. const doubleCount = computed(() => count.value * 2)
//********COMPUTEDS*********

//********LIFECYCLE HOOKS*********
//Ex const onMounted(() => { console.log('mounted') })
onMounted(() => {
  editor.value = new Editor({
    content: editorContent.value,
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: "tiptap-paragraph",
        },
      }),
      Text,
      StarterKit.configure({
        hardBreak: false, // Desabilita o HardBreak do StarterKit para usar nossa configuração
      }),
      HardBreak.configure({
        HTMLAttributes: {
          class: "tiptap-hard-break",
        },
        keepMarks: false,
      }),
      Gapcursor,
      Color,
      TextStyle,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    onUpdate: () => {
      emit("update:modelValue", editor.value.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
  });
});

onBeforeUnmount(() => {
  editor.value.destroy();
});
//********LIFECYCLE HOOKS*********

//********METHODS*********
//Métodos: insira aqui os métodos do componente.
// EX. const increment = () => { count.value++ }
const handleUploadImage = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        editor.value
          .chain()
          .focus()
          .insertContent({
            type: "image",
            attrs: { src: fileReader.result },
          })
          .run();
      };
    }
  };
  input.click();
};
//********METHODS*********

//********OUTROS*********
//Outros
//********OUTROS*********
</script>

<style lang="scss">
.tiptap {
  height: 100vh !important;
  padding: 0.5rem; /* Add some padding */
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

  /* Paragraph styles */
  p {
    margin: 1rem 0;
    line-height: 1.6;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* Hard break styles */
  br {
    display: block;
    margin: 0.5rem 0;
    content: "";
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

/* Dark Mode Styles */
.tiptap-dark-mode {
  .editor-dark {
    background-color: rgb(var(--v-theme-bgcolor)) !important;
    color: #d4d4d4;
  }

  .tiptap {
    background-color: rgb(var(--v-theme-bgcolor)) !important;
    color: #d4d4d4;

    /* Code styles for dark mode */
    code {
      background-color: rgb(var(--v-theme-bgcolor)) !important;
      color: #ce9178 !important;
    }

    pre {
      background: rgb(var(--v-theme-bgcolor)) !important;
      color: #d4d4d4 !important;

      code {
        background: none;
        color: inherit;
      }
    }

    /* Blockquote for dark mode */
    blockquote {
      border-left: 3px solid rgb(var(--v-theme-bgcolor)) !important;
    }

    /* HR for dark mode */
    hr {
      border-top: 1px solid rgb(var(--v-theme-bgcolor)) !important;
    }

    /* Mark for dark mode */
    mark {
      background-color: #5a5a2d;
      color: #d4d4d4;
    }
  }
}

/* Estilos globais para conteúdo renderizado com v-html */
:global(.tiptap-content) {
  p {
    margin: 1rem 0;
    line-height: 1.6;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  br {
    display: block;
    margin: 0.5rem 0;
    content: "";
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    text-wrap: pretty;
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

  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  blockquote {
    border-left: 3px solid #e0e0e0;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  code {
    background-color: #f5f5f5;
    border-radius: 0.4rem;
    color: #333;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: #333;
    border-radius: 0.5rem;
    color: #fff;
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
}
</style>
