<script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { convertDateProperties } from '@utils/dateUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import CreateProjectForm from '@components/CreateProjectForm.vue'

  const itemsSop = ref([])
  const headersSop = ref([])
  const currentSop = ref({ assemblyDell: {} })
  const loadingTable = ref(false)
  const showCreateProject = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDeleteSops = 'AssemblyDell/DeleteSop'
  const endpointGetSops = 'AssemblyDell/GetSops'

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

  const loadData = async () => {
    loadingTable.value = true
    try {
      await Promise.all([getSops()])
    } catch (error) {
      console.error(error.message)
    } finally {
      loadingTable.value = false
    }
  }

  const deleteItem = (item) => {
    currentSop.value.assemblyDell.id = item
    showConfirmPassword.value = true
  }

  onMounted(loadData)
</script>

<template>
  <ConfirmPassword
    v-model:showDialog="showConfirmPassword"
    :endpoint="endpointDeleteSops"
    :data="currentSop"
    @success="loadData"
  />
  <CreateProjectForm
    v-model:showForm="showCreateProject"
    @success="loadData"
  />
  <DataManagementTable
    :items="itemsSop"
    :headers="headersSop"
    text-add-button="Create Project"
    v-model:loading="loadingTable"
    v-model:showForm="showCreateProject"
    @delete-item="deleteItem"
  />
</template>
