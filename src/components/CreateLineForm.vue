<script setup>
  import { ref, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const showForm = defineModel('showForm', {
    type: Boolean,
    required: true
  })

  const emit = defineEmits(['success'])

  const form = ref(null)
  const loading = ref(false)
  const currentLine = ref('')

  const endpointCreate = 'AssemblyDell/CreateLine'

  const createObject = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true
    try {
      const data = {
        LineName: currentLine.value
      }

      const response = await apiClient.post(endpointCreate, data)

      showForm.value = false
      form.value.reset()

      emit('success', response)
    } catch (error) {
      console.error(error)
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
        Create new line
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
          v-model="currentLine"
          class="mx-4 mb-2"
          variant="solo"
          label="Line name"
          :rules="[(value) => !!value || 'Line name is required']"
          :disabled="loading"
        />
        <v-card-actions class="justify-end">
          <v-btn
            :disabled="loading"
            text="Cancel"
            @click.stop="showForm = false"
          />
          <v-btn
            text="Create line"
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
