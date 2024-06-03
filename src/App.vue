<template>
  <v-app>
    <v-app-bar title="Application bar">
      <template #prepend>
        <v-app-bar-nav-icon @click.stop="navBarEnabled = !navBarEnabled" />
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="navBarEnabled">
      <v-list nav>
        <v-list-item
          v-for="route in navRoutes"
          :key="route.name"
          :to="route.path"
        >
          <v-list-item-title>{{ route.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main
      class="d-flex align-center justify-center"
      style="min-height: 300px"
    >
      <h1>Current page path: {{ $route.path }}</h1>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import routes from '@router/routes.js'
  import { ref } from 'vue'

  const navBarEnabled = ref(true)

  const navRoutes = routes.filter(
    (route) => route.meta?.hideInNav !== true && !route.redirect
  )
</script>
