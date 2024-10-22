<template>
  <v-navigation-drawer
    v-model="changeDrawer"
    @update:model-value="$emit('update:drawer', changeDrawer)"
  >
    <template v-slot:prepend>
      <v-list-item lines="two">
        <template #prepend>
          <v-avatar color="primary">
            <span class="text-h6">{{ $user?.initials }}</span>
          </v-avatar>
        </template>
        <template #title>
          <span>{{ $user?.name }}</span>
        </template>
        <template #subtitle>
          <span style="font-size: 0.8rem">
            {{ $user?.Profile?.profileName }}
          </span>
        </template>
      </v-list-item>
    </template>

    <v-divider />
    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, index) in itemsMenu"
        :key="index"
        :prepend-icon="item.icon"
        :value="item.id"
        :to="item.to"
        active-class="item-menu"
        @click="handleClick"
      >
        <template #subtitle>
          <span style="font-size: 0.8rem">{{ item.title }}</span>
        </template>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider />

      <div class="pa-2">
        <v-btn
          color="primary"
          class="text-none mb-12"
          variant="flat"
          block
          @click="logout"
        >
          Sair
        </v-btn>
      </div>
    </template>
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
const { getInitials } = useUtils();
const auth = useAuthStore();
const route = useRouter();

const emit = defineEmits(["update:drawer"]);

const changeDrawer = ref(props.drawer);

watchEffect(() => {
  changeDrawer.value = props.drawer;
});

const $user = computed(() => {
  const initials = getInitials(auth.$currentUser?.name!);
  return {
    ...auth.$currentUser,
    initials,
  };
});

const itemsMenu = computed(() => {
  const items = auth.$currentUser?.Profile.ProfileRoute!.map((item) => {
    return {
      title: item.title,
      to: item.to,
      icon: item.icon,
      visible: item.visible,
      isMenu: item.isMenu,
      id: item.id,
    };
  }).filter((item) => item.visible && item.isMenu);

  return items;
});

const handleClick = () => {
  if (props.mobile) {
    changeDrawer.value = false;
    emit("update:drawer", changeDrawer.value);
  }
};

const logout = () => {
  auth.logout();
  route.push("/");
};
</script>

<style scoped>
.item-menu {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-itemMenu)) !important;
}
</style>
