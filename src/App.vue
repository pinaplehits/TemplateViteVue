<script setup>
  import { RouterView } from 'vue-router'
  import routes from '@router/routes.js'
  import { ref, toRef } from 'vue'
  import { useAuthStore } from '@stores/authStore.js'

  const rail = ref()
  const isLoggedIn = toRef(useAuthStore(), 'isLoggedIn')

  const navRoutes = routes.filter(
    (route) => route.meta?.showInNav === true && !route.redirect
  )
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-if="isLoggedIn"
      :expand-on-hover="!rail"
      :rail="!rail"
    >
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-account-outline"
          title="Roberto Piña"
          subtitle="roberto.pina@foxconn.com"
        >
          <template #append>
            <v-radio
              @click="rail = !rail"
              density="compact"
              color="grey-darken-2"
              v-model="rail"
            />
          </template>
        </v-list-item>
        <v-list-item
          v-for="route in navRoutes"
          :key="route.name"
          :to="route.path"
          :title="route.name"
          prepend-icon="mdi-currency-eth"
        />
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn
            block
            @click="useAuthStore().logout"
            append-icon="mdi-logout"
          >
            <template v-if="rail">Logout</template>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main
      class="d-flex align-center justify-center"
      style="background-color: #edede9"
    >
      <router-view />
    </v-main>
  </v-app>
</template>
