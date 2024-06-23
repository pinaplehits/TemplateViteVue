<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import CreateAreaForm from '@components/CreateAreaForm.vue'

  const items = ref([])
  const headers = ref([])
  const currentItem = ref({ assemblyDellArea: {} })
  const loading = ref(false)
  const showCreate = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDelete = 'AssemblyDell/DeleteArea'
  const endpointGet = 'AssemblyDell/GetAreas'

  const loadData = async () => {
    loading.value = true
    try {
      const [response] = await Promise.all([populateAdminTable(endpointGet)])

      items.value = response.items
      headers.value = response.headers
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentItem.value.assemblyDellArea.id = item
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
  <CreateAreaForm
    v-model:showForm="showCreate"
    @success="loadData"
  />
  <DataManagementTable
    :items="items"
    :headers="headers"
    text-add-button="Create area"
    v-model:loading="loading"
    v-model:showForm="showCreate"
    @delete-item="deleteItem"
  />
</template>
