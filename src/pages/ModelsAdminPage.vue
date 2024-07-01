<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import GenericForm from '@components/GenericForm.vue'

  const items = ref([])
  const headers = ref([])
  const currentItem = ref({ assemblyDellModel: {} })
  const loading = ref(false)
  const showForm = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDelete = 'AssemblyDell/DeleteModel'
  const endpointGet = 'AssemblyDell/GetModels'

  const form = ref({
    title: 'Create Model',
    buttonText: 'Create model',
    endpoint: 'AssemblyDell/CreateModel',
    data: {}
  })

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
    currentItem.value.assemblyDellModel.id = item
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
      v-model="form.data.ModelName"
      class="mx-4 mb-2"
      variant="solo"
      label="Model name"
      :rules="[(value) => !!value || 'Model name is required']"
      :disabled="loading"
    />
    <v-text-field
      v-model="form.data.Platform"
      class="mx-4"
      variant="solo"
      label="Platform name"
      :rules="[(value) => !!value || 'Platform name is required']"
      :disabled="loading"
    />
  </GenericForm>
  <DataManagementTable
    :items="items"
    :headers="headers"
    text-add-button="Create model"
    v-model:loading="loading"
    v-model:showForm="showForm"
    @delete-item="deleteItem"
  />
</template>
