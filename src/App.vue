<template>
  <v-app>
    <v-app-bar
      v-if="isLoggedIn"
      title="Application bar"
    >
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="navBarEnabled = !navBarEnabled" />
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-if="isLoggedIn"
      v-model="navBarEnabled"
    >
      <v-list nav>
        <v-list-item
          v-for="route in navRoutes"
          :key="route.name"
          :to="route.path"
          :title="route.name"
        />
      </v-list>
    </v-navigation-drawer>
    <v-main
      class="d-flex align-center justify-center"
      style="background-color: #faf8f6"
    >
      <router-view class="bg-white" />
    </v-main>
  </v-app>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import routes from '@router/routes.js'
  import { ref } from 'vue'
  import { useAuthStore } from '@stores/authStore.js'

  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn

  const navBarEnabled = ref(true)

  const navRoutes = routes.filter(
    (route) => route.meta?.hideInNav !== true && !route.redirect
  )
</script>
