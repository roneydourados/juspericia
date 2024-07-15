<template>
  <DialogForm :show="show" :title="title" :width="width">
    <FormCrud :on-submit="submitForm"> </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "",
  },
});

const submitForm = async (data: any) => {
  console.log(data);
};
</script>
