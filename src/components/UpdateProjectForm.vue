<script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import router from '@router/index.js'

  const emit = defineEmits(['success'])

  const itemsModel = ref([])
  const itemsArea = ref([])
  const itemsLine = ref([])
  const form = ref(null)
  const loading = ref(false)
  const changesMade = ref(true)

  const currentProjectName = ref('')
  const currentModel = ref('')
  const currentArea = ref('')
  const currentLines = ref([])

  const endpointGetModels = 'AssemblyDell/GetModels'
  const endpointGetAreas = 'AssemblyDell/GetAreas'
  const endpointGetLines = 'AssemblyDell/GetLines'
  const endpointCreate = 'AssemblyDell/CreateSop'

  const getModels = async () => {
    try {
      const { data } = await apiClient.get(endpointGetModels)

      itemsModel.value = data.items.map((item) => ({
        ...item,
        title: `${item.Model} - ${item.Platform}`
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

      form.value.reset()

      emit('success', response)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  onMounted(loadData)
</script>

<template>
  <v-card
    class="px-2 py-2 mx-4"
    min-width="450"
  >
    <v-card-title
      class="mb-n1"
      style="font-weight: bold"
    >
      Update
    </v-card-title>
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
      <v-card-actions class="justify-end">
        <v-btn
          :disabled="loading"
          text="Back"
          @click.stop="router.push({ name: 'SOP' })"
        />
        <v-btn
          text="Update"
          :disabled="loading || changesMade"
          :loading="loading"
          color="primary"
          type="submit"
          variant="outlined"
          @click.stop="createObject"
        />
      </v-card-actions>
    </v-form>
  </v-card>
</template>
