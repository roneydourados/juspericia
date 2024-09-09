<template>
  <div>
    <v-card flat rounded="lg">
      <v-card-title>
        <HeaderPage title="Minhas Indicações" />
        <span class="text-grey">
          Indique juspericia e receba prêmios mais pontos
        </span>
        <v-divider class="mt-2" />
      </v-card-title>
      <v-card-text>
        <v-card flat rounded="lg">
          <v-card-title>
            <HeaderPage title="Indicações realizadas" />
          </v-card-title>
          <v-card-text>
            <v-row dense justify="end">
              <v-col cols="12" lg="2">
                <v-card rounded="lg" flat elevation="4" height="100">
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-arrange-send-backward"
                      start
                      size="25"
                      color="info"
                    />
                    <span class="text-grey text-subtitle-1"> Indicações </span>
                  </v-card-title>
                  <v-card-text class="d-flex align-center justify-center">
                    <!-- <span class="text-h5 font-weight-bold">4</span> -->
                    <v-chip label color="info" variant="flat">
                      <span class="text-h6 font-weight-bold">4</span>
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" lg="2">
                <v-card rounded="lg" flat elevation="4" height="100">
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-arrange-send-to-back"
                      start
                      size="25"
                      color="success"
                    />
                    <span class="text-grey text-subtitle-1"> Pontos </span>
                  </v-card-title>
                  <v-card-text class="d-flex align-center justify-center">
                    <v-chip label color="success" variant="flat">
                      <span class="text-h6 font-weight-bold">123</span>
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts"></script>
