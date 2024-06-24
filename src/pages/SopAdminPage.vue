<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import CreateProjectForm from '@components/CreateProjectForm.vue'
  import router from '@router/index.js'

  const items = ref([])
  const headers = ref([])
  const currentItem = ref({ assemblyDellSop: {} })
  const loading = ref(false)
  const showCreate = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDelete = 'AssemblyDell/DeleteSop'
  const endpointGet = 'AssemblyDell/GetSops'

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
    currentItem.value.assemblyDellSop.id = item
    showConfirmPassword.value = true
  }

  const detailItem = (item) => {
    router.push({ name: 'SOP details', params: { id: item } })
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
  <CreateProjectForm
    v-model:showForm="showCreate"
    @success="loadData"
  />
  <DataManagementTable
    :items="items"
    :headers="headers"
    text-add-button="Create Project"
    v-model:loading="loading"
    v-model:showForm="showCreate"
    @delete-item="deleteItem"
    @detail-item="detailItem"
  />
</template>
