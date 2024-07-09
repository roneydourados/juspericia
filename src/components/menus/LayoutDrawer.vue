<template>
  <v-navigation-drawer
    v-model="changeDrawer"
    color="white"
    auto
    @update:model-value="$emit('update:drawer', changeDrawer)"
  >
    <template v-slot:prepend>
      <v-list-item
        lines="two"
        prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
        subtitle="Logged in"
        title="Jane Smith"
      ></v-list-item>
    </template>

    <v-divider />
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home-city"
        title="Home"
        value="home"
        @click="closeDrawer"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account"
        title="My Account"
        value="account"
        @click="closeDrawer"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-group-outline"
        title="Users"
        value="users"
        @click="closeDrawer"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
  mobile: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:drawer"]);

const changeDrawer = ref(props.drawer);

watchEffect(() => {
  changeDrawer.value = props.drawer;
});

const closeDrawer = () => {
  if (props.mobile) {
    changeDrawer.value = false;
    emit("update:drawer", changeDrawer.value);
  }
};
</script>
