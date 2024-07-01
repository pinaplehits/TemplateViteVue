<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import GenericForm from '@components/GenericForm.vue'

  const currentItem = ref({ assemblyDellLine: {} })
  const loading = ref(false)
  const showForm = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDelete = 'AssemblyDell/DeleteLine'
  const endpointGet = 'AssemblyDell/GetLines'

  const dataTable = ref({
    items: [],
    headers: [],
    title: 'Lines Management',
    subtitle: 'Manage and organize lines for Assembly Dell projects',
    textAddButton: 'Create lines'
  })

  const form = ref({
    title: 'Create Line',
    buttonText: 'Create line',
    endpoint: 'AssemblyDell/CreateLine',
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
    currentItem.value.assemblyDellLine.id = item
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
      v-model="form.data.LineName"
      class="mx-4 mb-2"
      variant="solo"
      label="Line name"
      :rules="[(value) => !!value || 'Line name is required']"
      :disabled="loading"
    />
    <v-text-field
      v-model="form.data.Type"
      class="mx-4"
      variant="solo"
      label="Type"
      :rules="[(value) => !!value || 'Type is required']"
      :disabled="loading"
    />
  </GenericForm>
  <DataManagementTable
    v-bind="dataTable"
    v-model:loading="loading"
    v-model:showForm="showForm"
    @delete-item="deleteItem"
  />
</template>
