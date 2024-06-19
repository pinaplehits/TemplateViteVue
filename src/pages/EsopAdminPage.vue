<script setup>
  import { ref, onMounted, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { convertDateProperties } from '@utils/dateUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'

  const search = ref('')
  const searchFocused = ref(false)
  const loading = ref(false)
  const loadingCreateForm = ref(false)
  const form = ref(null)

  const itemsSop = ref([])
  const headersSop = ref([])
  const currentSop = ref({ assemblyDell: {} })

  const itemsModel = ref([])
  const itemsArea = ref([])
  const itemsLine = ref([])

  const endpointDeleteSops = 'AssemblyDell/DeleteSop'
  const endpointGetSops = 'AssemblyDell/GetSops'
  const endpointGetModels = 'AssemblyDell/GetModels'
  const endpointGetAreas = 'AssemblyDell/GetAreas'
  const endpointGetLines = 'AssemblyDell/GetLines'
  const endpointCreateSop = 'AssemblyDell/CreateSop'

  const showCreateProject = ref(false)
  const currentProjectName = ref('')
  const currentModel = ref('')
  const currentArea = ref('')
  const currentLines = ref([])

  const showConfirmPassword = ref(false)

  const getSops = async () => {
    try {
      const { data } = await apiClient.get(endpointGetSops)

      itemsSop.value = convertDateProperties(data)

      headersSop.value = data.headers.filter(
        (header) => header.visible === true
      )
      headersSop.value.push({ title: 'Actions', key: 'Actions' })
    } catch (error) {
      itemsSop.value = []
      headersSop.value = []

      throw new Error(error)
    }
  }

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
      await Promise.all([getSops(), getModels(), getAreas(), getLines()])
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentSop.value.assemblyDell.id = item
    showConfirmPassword.value = true
  }

  const createProject = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    loadingCreateForm.value = true
    try {
      const data = {
        ProjectName: currentProjectName.value,
        ModelId: currentModel.value,
        AreaId: currentArea.value,
        LinesId: currentLines.value
      }

      await apiClient.post(endpointCreateSop, data)

      showCreateProject.value = false
      form.value.reset()

      try {
        loading.value = true
        await getSops()
      } finally {
        loading.value = false
      }
    } catch (error) {
      console.error(error)
    } finally {
      loadingCreateForm.value = false
    }
  }

  onMounted(loadData)

  watch(showCreateProject, (newValue) => {
    if (!newValue) form.value.reset()
  })
</script>

<template>
  <ConfirmPassword
    v-model:showDialog="showConfirmPassword"
    :endpoint="endpointDeleteSops"
    :data="currentSop"
    @success="getSops"
  />
  <v-container fill-height>
    <v-card>
      <v-container>
        <v-row align="center">
          <v-col>
            <v-text-field
              v-model="search"
              density="compact"
              label="Search"
              :prepend-inner-icon="searchFocused ? '' : 'mdi-magnify'"
              single-line
              variant="outlined"
              flat
              color="primary"
              class="my-1"
              style="max-width: 500px"
              hide-details
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click.stop="showCreateProject = true"
              text="Create project"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-dialog
        :persistent="loadingCreateForm"
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
              :disabled="loadingCreateForm"
            />
            <v-autocomplete
              v-model="currentModel"
              class="mx-4 mb-2"
              variant="solo"
              :items="itemsModel"
              item-value="id"
              label="Models"
              :rules="[(value) => !!value || 'Model is required']"
              :disabled="loadingCreateForm"
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
              :disabled="loadingCreateForm"
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
              :disabled="loadingCreateForm"
            />
            <v-card-actions class="justify-end">
              <v-btn
                :disabled="loadingCreateForm"
                text="Cancel"
                @click.stop="showCreateProject = false"
              />
              <v-btn
                text="Create project"
                :disabled="loadingCreateForm"
                :loading="loadingCreateForm"
                type="submit"
                @click.stop="createProject"
              />
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-divider />
      <DataManagementTable
        :items="itemsSop"
        :headers="headersSop"
        v-model:loading="loading"
        v-model:search="search"
        @delete-item="deleteItem"
      />
    </v-card>
  </v-container>
</template>
