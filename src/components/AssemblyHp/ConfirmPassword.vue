<script setup>
  import { ref, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const showDialog = defineModel('showDialog', {
    type: Boolean,
    required: true
  })

  const props = defineProps({
    endpoint: { type: String, required: true },
    data: { type: Object, required: true }
  })

  const emit = defineEmits(['success'])

  const loading = ref(false)
  const form = ref(null)
  const password = ref('')
  const passwordVisible = ref(false)
  const errorMessage = ref('')

  const validate = async () => {
    errorMessage.value = ''

    const { valid } = await form.value.validate()

    if (!valid) return

    loading.value = true

    try {
      const response = await apiClient.delete(props.endpoint, {
        data: {
          ...props.data,
          password: password.value
        }
      })

      showDialog.value = false
      emit('success', response)
    } catch (error) {
      errorMessage.value = error
    } finally {
      loading.value = false
    }
  }

  watch(
    () => props.showDialog,
    (newValue) => {
      if (!newValue) {
        form.value.reset()
        passwordVisible.value = false
        errorMessage.value = ''
      }
    }
  )
</script>

<template>
  <v-dialog
    :persistent="loading"
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
          :error-messages="errorMessage"
          @click:append-inner="passwordVisible = !passwordVisible"
        />
        <v-card-actions class="justify-end">
          <v-btn
            :disabled="loading"
            text="Cancel"
            @click.stop="showDialog = false"
          />
          <v-btn
            text="Delete"
            :disabled="loading"
            :loading="loading"
            type="submit"
            class="delete-button"
            @click="validate"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .v-btn {
    text-transform: none;
  }
  .delete-button {
    background-color: #b00020;
    color: white;
    font-weight: 600;
  }
</style>
