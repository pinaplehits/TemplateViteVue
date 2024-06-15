<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@stores/authStore.js'

  const form = ref()
  const username = ref(null)
  const password = ref(null)
  const passwordVisible = ref(false)
  const errorMessage = ref(null)
  const loading = ref(false)
  const loadingLogin = ref(false)
  const loadingProduction = ref(false)
  const router = useRouter()

  const login = async () => {
    if (loading.value) return

    errorMessage.value = null

    const { valid } = await form.value.validate()

    if (!valid)
      return (errorMessage.value = 'Please fill in all required fields')

    try {
      loading.value = true
      loadingLogin.value = true

      await useAuthStore().login({
        username: username.value,
        password: password.value
      })

      router.push({ name: 'Home' })
    } catch (error) {
      errorMessage.value = error
    } finally {
      loadingLogin.value = false
      loading.value = false
    }
  }

  const loginProduction = async () => {
    form.value.resetValidation()
    errorMessage.value = null

    if (loading.value) return

    try {
      loading.value = true
      loadingProduction.value = true
      await useAuthStore().loginProduction()
      router.push({ name: 'ProductionSOP' })
    } catch (error) {
      errorMessage.value = error
    } finally {
      loadingProduction.value = false
      loading.value = false
    }
  }
</script>

<template>
  <v-card
    width="600"
    elevation="6"
    variant="outlined"
    @keypress.enter="login"
  >
    <v-toolbar
      title="Login"
      style="background-color: #0065b3; color: white"
    />
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent
      >
        <v-text-field
          autofocus
          v-model="username"
          label="Username"
          :rules="[(value) => !!value || 'Username is required']"
          variant="solo"
          :disabled="loading"
        />
        <v-text-field
          v-model="password"
          label="Password"
          :rules="[(value) => !!value || 'Password is required']"
          variant="solo"
          :disabled="loading"
          :type="passwordVisible ? 'text' : 'password'"
          :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="passwordVisible = !passwordVisible"
          class="mt-3 mb-2"
        />
        <div class="d-flex justify-space-between align-center">
          <span style="color: #b00020; margin-left: 0.5rem; margin-top: 0.5rem">
            {{ errorMessage }}
          </span>
          <v-btn
            @click="login"
            :disabled="loading"
            :loading="loadingLogin"
            elevation="3"
            text="Login"
            class="mr-2"
            type="submit"
          />
        </div>
      </v-form>
    </v-card-text>
    <v-divider class="border-opacity-50 mx-6 mt-2" />
    <v-card-actions>
      <v-btn
        @click="loginProduction"
        :disabled="loading"
        :loading="loadingProduction"
        elevation="4"
        class="my-3 mx-auto"
        text="Enter production"
        type="submit"
      />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .v-btn {
    color: white;
    background-color: #0065b3;
    font-weight: bold;
  }
</style>
