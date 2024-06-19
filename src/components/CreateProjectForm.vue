<script setup>
  import { ref, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const showCreateProject = defineModel('showCreateProject', {
    type: Boolean,
    required: true
  })

  const emit = defineEmits(['success'])

  const itemsModel = ref([])
  const itemsArea = ref([])
  const itemsLine = ref([])
  const form = ref(null)
  const loading = ref(false)
  const loadingCreatingProject = ref(false)

  const currentProjectName = ref('')
  const currentModel = ref('')
  const currentArea = ref('')
  const currentLines = ref([])

  const endpointGetModels = 'AssemblyDell/GetModels'
  const endpointGetAreas = 'AssemblyDell/GetAreas'
  const endpointGetLines = 'AssemblyDell/GetLines'
  const endpointCreateSop = 'AssemblyDell/CreateSop'

  const getModels = async () => {
    try {
      const { data } = await apiClient.get(endpointGetModels)

      itemsModel.value = data.items.map((item) => ({
        ...item,
        title: `${item.Model} - ${item.Description}`
      }))
    } catch (error) {
      itemsModel.value = []

      throw new Error(error)
    }
  }

  const getAreas = async () => {
    try {
      const { data } = await apiClient.get(endpointGetAreas)

      itemsArea.value = data.items
    } catch (error) {
      itemsArea.value = []

      throw new Error(error)
    }
  }

  const getLines = async () => {
    try {
      const { data } = await apiClient.get(endpointGetLines)

      itemsLine.value = data.items
    } catch (error) {
      itemsLine.value = []

      throw new Error(error)
    }
  }

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

  const createProject = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    loadingCreatingProject.value = true
    try {
      const data = {
        ProjectName: currentProjectName.value,
        ModelId: currentModel.value,
        AreaId: currentArea.value,
        LinesId: currentLines.value
      }

      const response = await apiClient.post(endpointCreateSop, data)

      showCreateProject.value = false
      form.value.reset()

      emit('success', response)
    } catch (error) {
      console.error(error)
    } finally {
      loadingCreatingProject.value = false
    }
  }

  // onMounted(loadData)

  watch(showCreateProject, (newValue) => {
    if (!newValue) form.value.reset()

    if (newValue) loadData()
  })
</script>

<template>
  <v-dialog
    :persistent="loadingCreatingProject"
    v-model="showCreateProject"
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
          :disabled="loadingCreatingProject"
        />
        <v-autocomplete
          v-model="currentModel"
          class="mx-4 mb-2"
          variant="solo"
          :items="itemsModel"
          item-value="id"
          label="Models"
          :rules="[(value) => !!value || 'Model is required']"
          :disabled="loadingCreatingProject"
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
          :disabled="loadingCreatingProject"
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
          :disabled="loadingCreatingProject"
        />
        <v-card-actions class="justify-end">
          <v-btn
            :disabled="loadingCreatingProject"
            text="Cancel"
            @click.stop="showCreateProject = false"
          />
          <v-btn
            text="Create project"
            :disabled="loadingCreatingProject"
            :loading="loadingCreatingProject"
            type="submit"
            @click.stop="createProject"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
