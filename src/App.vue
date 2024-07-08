<script setup>
  import { RouterView } from 'vue-router'
  import routes from '@router/routes.js'
  import { ref, toRef } from 'vue'
  import { useAuthStore } from '@stores/authStore.js'
  import { useNavStore } from '@stores/navStore.js'

  const isLoggedIn = toRef(useAuthStore(), 'isLoggedIn')
  const user = toRef(useAuthStore(), 'user')
  const rail = toRef(useNavStore(), 'rail')
  const isHovered = ref(false)

  const navRoutes = routes.filter(
    (route) => route.meta?.showInNav === true && !route.redirect
  )
</script>

<template>
  <v-app>
    <v-navigation-drawer
      v-if="isLoggedIn"
      expand-on-hover
      :rail="!rail"
      permanent
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-account-outline"
          :title="user?.name"
          :subtitle="user?.email"
        >
          <template #append>
            <v-radio
              @click.stop="() => useNavStore().setRail(!rail)"
              density="compact"
              color="grey-darken-2"
              v-model="rail"
            />
          </template>
        </v-list-item>
        <v-list-group
          title="Test"
          fluid
        >
          <template #activator="{ props, isOpen }">
            <v-list-item
              v-bind="props"
              title="Assembly Dell"
              :prepend-icon="
                isOpen
                  ? 'mdi-arrange-bring-forward'
                  : 'mdi-arrange-send-backward'
              "
            />
          </template>
          <v-list-item
            v-for="route in navRoutes"
            :key="route.name"
            :to="route.path"
            :title="route.name"
            prepend-icon="mdi-currency-eth"
            :class="rail || isHovered ? 'ml-2' : ''"
          />
        </v-list-group>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn
            block
            @click="useAuthStore().logout"
            append-icon="mdi-logout"
          >
            <template v-if="rail || isHovered">
              Logout
            </template>
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
