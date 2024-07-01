<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import GenericForm from '@components/GenericForm.vue'

  const currentItem = ref({ assemblyDellArea: {} })
  const loading = ref(false)
  const showForm = ref(false)
  const showConfirmPassword = ref(false)
  const errorMessage = ref(null)

  const endpointDelete = 'AssemblyDell/DeleteArea'
  const endpointGet = 'AssemblyDell/GetAreas'

  const dataTable = ref({
    items: [],
    headers: [],
    title: 'Areas Management',
    subtitle: 'Manage and organize areas for Assembly Dell projects',
    textAddButton: 'Create area'
  })
  const form = ref({
    title: 'Create Area',
    buttonText: 'Create area',
    endpoint: 'AssemblyDell/CreateArea',
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
  <GenericForm
    v-model:showForm="showForm"
    v-bind="form"
    @submit-success="loadData"
  >
    <v-text-field
      autofocus
      v-model="form.data.AreaName"
      class="mx-4"
      variant="solo"
      label="Area name"
      :rules="[(value) => !!value || 'Area name is required']"
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
