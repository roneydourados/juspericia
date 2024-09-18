<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            <div class="text-subtitle-1 font-weight-bold">
              Dados da consulta
            </div>
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn class="text-none" @click="dialog = false">
              <strong class="text-error">Cancelar</strong>
            </v-btn>
            <v-btn class="text-none" @click="dialog = false">
              <strong class="text-info">Iniciar consulta</strong>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-list lines="two" subheader>
          <v-list-subheader>User Controls</v-list-subheader>
          <v-list-item
            subtitle="Set the content filtering level to restrict apps that can be downloaded"
            title="Content filtering"
            link
          ></v-list-item>
          <v-list-item
            subtitle="Require password for purchase or use password to restrict purchase"
            title="Password"
            link
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-subheader>General</v-list-subheader>
          <v-list-item
            subtitle="Notify me about updates to apps or games that I downloaded"
            title="Notifications"
            @click="notifications = !notifications"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  v-model="notifications"
                  color="primary"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          <v-list-item
            subtitle="Auto-update apps at any time. Data charges may apply"
            title="Sound"
            @click="sound = !sound"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  v-model="sound"
                  color="primary"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
          <v-list-item
            subtitle="Automatically add home screen widgets"
            title="Auto-add widgets"
            @click="widgets = !widgets"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  v-model="widgets"
                  color="primary"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const dialog = defineModel({ default: false });
const notifications = shallowRef(false);
const sound = shallowRef(true);
const widgets = shallowRef(false);
</script>
