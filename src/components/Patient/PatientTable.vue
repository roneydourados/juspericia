<template>
  <div>
    <Table title="Pacientes" @add="showForm = true" />
    <PatientForm :show="showForm" title="Paciente" />
  </div>
</template>

<script setup lang="ts">
const itemSelected = ref();
const showForm = ref(false);
</script>
