<script setup>
  import { ref, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const showForm = defineModel('showForm', {
    type: Boolean,
    required: true
  })

  const emit = defineEmits(['success'])

  const form = ref(null)
  const errorMessage = ref(null)
  const loading = ref(false)
  const currentArea = ref('')

  const endpointCreate = 'AssemblyDell/CreateArea'

  const createObject = async () => {
    errorMessage.value = null
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true
    try {
      const data = {
        AreaName: currentArea.value
      }

      const response = await apiClient.post(endpointCreate, data)

      showForm.value = false
      form.value.reset()

      emit('success', response)
    } catch (error) {
      errorMessage.value = error
    } finally {
      loading.value = false
    }
  }

  watch(showForm, (newValue) => {
    if (!newValue) form.value.reset()
  })
</script>

<template>
  <v-dialog
    :persistent="loading"
    v-model="showForm"
    max-width="600"
  >
    <v-card class="px-2 py-2">
      <v-card-title
        class="mb-n1"
        style="font-weight: bold"
      >
        Create new area
      </v-card-title>
      <v-card-subtitle class="mb-5">
        Please ensure all fields are filled out before proceeding.
      </v-card-subtitle>
      <v-form
        ref="form"
        @submit.prevent
      >
        <v-text-field
          autofocus
          v-model="currentArea"
          class="mx-4"
          variant="solo"
          label="Area name"
          :rules="[(value) => !!value || 'Area name is required']"
          :disabled="loading"
          :error-messages="errorMessage"
        />
        <v-card-actions class="justify-end">
          <v-btn
            :disabled="loading"
            text="Cancel"
            @click.stop="showForm = false"
          />
          <v-btn
            text="Create area"
            :disabled="loading"
            :loading="loading"
            type="submit"
            @click.stop="createObject"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
