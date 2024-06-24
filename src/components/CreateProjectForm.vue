<script setup>
  import { ref, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const showForm = defineModel('showForm', {
    type: Boolean,
    required: true
  })

  const emit = defineEmits(['success'])

  const itemsModel = ref([])
  const itemsArea = ref([])
  const itemsLine = ref([])
  const form = ref(null)
  const errorMessage = ref(null)
  const loading = ref(false)

  const currentProjectName = ref('')
  const currentModel = ref('')
  const currentArea = ref('')
  const currentLines = ref([])

  const endpointGetModels = 'AssemblyDell/GetModels'
  const endpointGetAreas = 'AssemblyDell/GetAreas'
  const endpointGetLines = 'AssemblyDell/GetLines'
  const endpointCreate = 'AssemblyDell/CreateSop'

  const getModels = async () => {
    const { items } = await apiClient.get(endpointGetModels)

    if (!items) return

    itemsModel.value = items.map((item) => ({
      ...item,
      title: `${item.Model} - ${item.Platform}`
    }))
  }

  const getAreas = async () =>
    (itemsArea.value = (await apiClient.get(endpointGetAreas)).items)

  const getLines = async () =>
    (itemsLine.value = (await apiClient.get(endpointGetLines)).data.items)

  const loadData = async () => {
    loading.value = true
    try {
      await Promise.all([getModels(), getAreas(), getLines()])
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const createObject = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true
    try {
      const data = {
        ProjectName: currentProjectName.value,
        ModelId: currentModel.value,
        AreaId: currentArea.value,
        LinesId: currentLines.value
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
    if (!newValue) {
      errorMessage.value = null
      form.value.reset()
    }

    if (newValue) loadData()
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
        Create new project
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
          v-model="currentProjectName"
          class="mx-4 mb-2"
          variant="solo"
          label="Project name"
          :rules="[(value) => !!value || 'Project name is required']"
          :disabled="loading"
        />
        <v-autocomplete
          v-model="currentModel"
          class="mx-4 mb-2"
          variant="solo"
          :items="itemsModel"
          item-value="id"
          label="Models"
          :rules="[(value) => !!value || 'Model is required']"
          :disabled="loading"
        />
        <v-autocomplete
          v-model="currentArea"
          class="mx-4 mb-2"
          variant="solo"
          :items="itemsArea"
          item-title="Area"
          item-value="id"
          label="Areas"
          :rules="[(value) => !!value || 'Area is required']"
          :disabled="loading"
        />
        <v-autocomplete
          v-model="currentLines"
          chips
          multiple
          class="mx-4"
          variant="solo"
          :items="itemsLine"
          item-title="Name"
          item-value="id"
          label="Lines"
          :rules="[
            (value) => value.length > 0 || 'At least one line is required'
          ]"
          :disabled="loading"
        />
        <v-card-text
          v-if="errorMessage"
          style="color: #b00020"
        >
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            :disabled="loading"
            text="Cancel"
            @click.stop="showForm = false"
          />
          <v-btn
            text="Create project"
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
