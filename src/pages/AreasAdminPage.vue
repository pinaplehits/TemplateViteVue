<script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { convertDateProperties } from '@utils/dateUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import CreateAreaForm from '@components/CreateAreaForm.vue'

  const itemsSop = ref([])
  const headersSop = ref([])
  const currentSop = ref({ assemblyDellArea: {} })
  const loading = ref(false)
  const showCreateArea = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDeleteSops = 'AssemblyDell/DeleteArea'
  const endpointGetAreas = 'AssemblyDell/GetAreas'

  const getAreas = async () => {
    try {
      const { data } = await apiClient.get(endpointGetAreas)

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
    loading.value = true
    try {
      await Promise.all([getAreas()])
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentSop.value.assemblyDellArea.id = item
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
  <CreateAreaForm
    v-model:showForm="showCreateArea"
    @success="loadData"
  />
  <DataManagementTable
    :items="itemsSop"
    :headers="headersSop"
    text-add-button="Create area"
    v-model:loading="loading"
    v-model:showForm="showCreateArea"
    @delete-item="deleteItem"
  />
</template>
