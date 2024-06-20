<script setup>
  import { ref, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const showForm = defineModel('showForm', {
    type: Boolean,
    required: true
  })

  const emit = defineEmits(['success'])

  const form = ref(null)
  const loadingCreatingArea = ref(false)
  const currentArea = ref('')

  const endpointCreateArea = 'AssemblyDell/CreateArea'

  const createProject = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    loadingCreatingArea.value = true
    try {
      const data = {
        AreaName: currentArea.value
      }

      const response = await apiClient.post(endpointCreateArea, data)

      showForm.value = false
      form.value.reset()

      emit('success', response)
    } catch (error) {
      console.error(error)
    } finally {
      loadingCreatingArea.value = false
    }
  }

  watch(showForm, (newValue) => {
    if (!newValue) form.value.reset()
  })
</script>

<template>
  <v-dialog
    :persistent="loadingCreatingArea"
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
          class="mx-4 mb-2"
          variant="solo"
          label="Area name"
          :rules="[(value) => !!value || 'Area name is required']"
          :disabled="loadingCreatingArea"
        />
        <v-card-actions class="justify-end">
          <v-btn
            :disabled="loadingCreatingArea"
            text="Cancel"
            @click.stop="showForm = false"
          />
          <v-btn
            text="Create area"
            :disabled="loadingCreatingArea"
            :loading="loadingCreatingArea"
            type="submit"
            @click.stop="createProject"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
