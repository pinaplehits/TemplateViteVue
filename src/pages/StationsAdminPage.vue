<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import CreateStationForm from '@components/CreateStationForm.vue'

  const items = ref([])
  const headers = ref([])
  const currentItem = ref({ assemblyDellStation: {} })
  const loading = ref(false)
  const showCreate = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDelete = 'AssemblyDell/DeleteStation'
  const endpointGet = 'AssemblyDell/GetStations'

  const loadData = async () => {
    loading.value = true
    try {
      const response = await populateAdminTable(endpointGet)

      items.value = response.items
      headers.value = response.headers
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentItem.value.assemblyDellStation.id = item
    showConfirmPassword.value = true
  }

  onMounted(loadData)
</script>

<template>
  <ConfirmPassword
    v-model:showDialog="showConfirmPassword"
    :endpoint="endpointDelete"
    :data="currentItem"
    @success="loadData"
  />
  <CreateStationForm
    v-model:showForm="showCreate"
    @success="loadData"
  />
  <DataManagementTable
    :items="items"
    :headers="headers"
    text-add-button="Create station"
    v-model:loading="loading"
    v-model:showForm="showCreate"
    @delete-item="deleteItem"
  />
</template>
