<script setup>
  import { RouterView } from 'vue-router'
  import routes from '@router/routes.js'
  import { toRef } from 'vue'
  import { useAuthStore } from '@stores/authStore.js'

  const isLoggedIn = toRef(useAuthStore(), 'isLoggedIn')

  const navRoutes = routes.filter(
    (route) => route.meta?.showInNav === true && !route.redirect
  )
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-if="isLoggedIn"
      expand-on-hover
      rail
    >
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-account-outline"
          subtitle="roberto.pina@foxconn.com"
          title="Roberto Piña"
        />
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
            text="Logout"
            @click="useAuthStore().logout"
          />
        </div>
      </template>
    </v-navigation-drawer>
    <v-main
      class="d-flex align-center justify-center"
      style="background-color: #a49b96"
    >
      <router-view />
    </v-main>
  </v-app>
</template>
