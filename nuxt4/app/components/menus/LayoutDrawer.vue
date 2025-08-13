<template>
  <v-navigation-drawer
    v-model="changeDrawer"
    @update:model-value="$emit('update:drawer', changeDrawer)"
    :width="mobile ? '' : '370'"
    class="drawer-color"
  >
    <template v-slot:prepend>
      <v-list-item lines="two">
        <template #title>
          <!-- <Logo /> -->
          <div class="d-flex justify-center w-100">
            <LogoSVG />
          </div>
        </template>
      </v-list-item>
    </template>

    <!-- <v-divider /> -->
    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, index) in itemsMenu"
        :key="index"
        :value="item.to"
        :to="item.to"
        active-class="item-menu"
        @click="handleClick"
      >
        <template #title>
          <v-icon :icon="item.icon" start color="colorIcon" />
          <span style="font-size: 0.9rem; color: #ffff">
            {{ item.title }}
          </span>
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
  <DialogLoading :dialog="loading" />
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

const auth = useAuthStore();
const route = useRouter();

const emit = defineEmits(["update:drawer"]);

const changeDrawer = ref(props.drawer);
const loading = ref(false);

watchEffect(() => {
  changeDrawer.value = props.drawer;
});

const itemsMenu = computed(() => {
  const items = auth.$currentUser?.profile
    ?.routes!.map((item) => {
      return {
        title: item.title,
        to: item.to,
        icon: item.icon,
        visible: item.visible,
        isMenu: item.isMenu,
        id: item.id,
      };
    })
    .filter((item) => item.visible && item.isMenu);

  return items;
});

const handleClick = () => {
  if (props.mobile) {
    changeDrawer.value = false;
    emit("update:drawer", changeDrawer.value);
  }
};

const logout = async () => {
  loading.value = true;
  try {
    auth.logout();
    await route.push("/");
  } catch (error) {
    console.log("🚀 ~ logout ~ error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.item-menu {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-itemMenu)) !important;
}

.drawer-color {
  background: linear-gradient(to bottom, #1e3c98, #4d84d5) !important;
}
</style>
