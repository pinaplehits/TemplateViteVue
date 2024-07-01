<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import GenericForm from '@components/GenericForm.vue'

  const currentItem = ref({ assemblyDellStation: {} })
  const loading = ref(false)
  const showForm = ref(false)
  const showConfirmPassword = ref(false)
  const errorMessage = ref(null)

  const endpointDelete = 'AssemblyDell/DeleteStation'
  const endpointGet = 'AssemblyDell/GetStations'

  const dataTable = ref({
    items: [],
    headers: [],
    title: 'Stations Management',
    subtitle: 'Manage and organize models for Assembly Dell projects',
    textAddButton: 'Create station'
  })

  const form = ref({
    title: 'Create Station',
    buttonText: 'Create station',
    endpoint: 'AssemblyDell/CreateStation',
    data: {}
  })

  const loadData = async () => {
    loading.value = true
    try {
      const response = await populateAdminTable(endpointGet)

      dataTable.value.items = response.items
      dataTable.value.headers = response.headers
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
  <GenericForm
    v-model:showForm="showForm"
    v-bind="form"
    @submit-success="loadData"
  >
    <v-text-field
      autofocus
      v-model="form.data.StationName"
      class="mx-4"
      variant="solo"
      label="Station name"
      :rules="[(value) => !!value || 'Station name is required']"
      :disabled="loading"
      :error-messages="errorMessage"
    />
  </GenericForm>
  <DataManagementTable
    v-bind="dataTable"
    v-model:loading="loading"
    v-model:showForm="showForm"
    @delete-item="deleteItem"
  />
</template>
