<script setup>
  import { ref, watch } from 'vue'

  const showDialog = ref(false)
  const loading = ref(false)
  const form = ref()
  const password = ref('')
  const passwordVisible = ref(false)

  watch(showDialog, (newValue) => {
    if (newValue === false) {
      form.value.reset()
      passwordVisible.value = false
    }
  })
</script>

<template>
  <v-dialog
    v-model="showDialog"
    max-width="525"
  >
    <v-card class="px-2 py-2">
      <v-card-title
        class="mb-n1"
        style="font-weight: bold"
      >
        Confirm Password
      </v-card-title>
      <v-card-subtitle class="mb-5">
        To proceed, please enter your password
      </v-card-subtitle>
      <v-form
        ref="form"
        @submit.prevent
      >
        <v-text-field
          autofocus
          class="mx-4"
          variant="outlined"
          color="primary"
          v-model="password"
          label="Password"
          :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="[(value) => !!value || 'Password is required']"
          :disabled="loading"
          @click:append-inner="passwordVisible = !passwordVisible"
        />
      </v-form>
      <v-card-actions>
        <v-btn
          text="Cancel"
          @click.stop="showDialog = false"
        />
        <v-btn
          text="Delete"
          :disable="loading"
          :loading="loading"
          type="submit"
          class="delete-button"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .v-btn {
    font-weight: bold;
  }

  .delete-button {
    background-color: #b00020;
    color: white;
  }
</style>
