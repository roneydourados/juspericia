<template>
  <AutoCompleteInput
    label="Fonte"
    :items="fontFamilyList"
    v-model="fontFamily"
    item-title="title"
    item-value="value"
    rounded="xl"
    style="max-width: 20%"
    class="mt-n1"
    @update:model-value="handleUpdateModel"
  />
</template>

<script setup lang="ts">
const fontFamilyList = ref([
  // Sans-serif fonts
  {
    title: "Arial",
    value: "Arial, sans-serif",
  },
  {
    title: "Helvetica",
    value: "Helvetica, Arial, sans-serif",
  },
  {
    title: "Verdana",
    value: "Verdana, Geneva, sans-serif",
  },
  {
    title: "Tahoma",
    value: "Tahoma, Geneva, sans-serif",
  },
  {
    title: "Trebuchet MS",
    value: "'Trebuchet MS', Helvetica, sans-serif",
  },
  {
    title: "Impact",
    value: "Impact, Charcoal, sans-serif",
  },
  {
    title: "Arial Black",
    value: "'Arial Black', Gadget, sans-serif",
  },
  {
    title: "Inter",
    value: "Inter, sans-serif",
  },
  {
    title: "Montserrat",
    value: "Montserrat, sans-serif",
  },

  // Serif fonts
  {
    title: "Times New Roman",
    value: "'Times New Roman', Times, serif",
  },
  {
    title: "Georgia",
    value: "Georgia, serif",
  },
  {
    title: "Garamond",
    value: "Garamond, serif",
  },
  {
    title: "Palatino",
    value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
  },
  {
    title: "Baskerville",
    value:
      "Baskerville, 'Baskerville Old Face', 'Hoefler Text', Garamond, 'Times New Roman', serif",
  },
  {
    title: "Serif",
    value: "serif",
  },

  // Monospace fonts
  {
    title: "Courier New",
    value: "'Courier New', Courier, monospace",
  },
  {
    title: "Monaco",
    value: "Monaco, 'Lucida Console', monospace",
  },
  {
    title: "Lucida Console",
    value: "'Lucida Console', Monaco, monospace",
  },
  {
    title: "Consolas",
    value: "Consolas, 'Lucida Console', monospace",
  },
  {
    title: "Monospace",
    value: "monospace",
  },

  // Cursive fonts
  {
    title: "Comic Sans MS",
    value: "'Comic Sans MS', Comic Sans, cursive",
  },
  {
    title: "Brush Script MT",
    value: "'Brush Script MT', cursive",
  },
  {
    title: "Bradley Hand",
    value: "'Bradley Hand', cursive",
  },
  {
    title: "Cursive",
    value: "cursive",
  },

  // Fantasy fonts
  {
    title: "Papyrus",
    value: "Papyrus, fantasy",
  },
  {
    title: "Herculanum",
    value: "Herculanum, fantasy",
  },
  {
    title: "Fantasy",
    value: "fantasy",
  },
]);

const emits = defineEmits(["update:modelValue"]);

const fontFamily = defineModel({
  default: "Inter",
});

const handleUpdateModel = () => {
  emits("update:modelValue", fontFamily.value);
};
</script>

<style scoped></style>
