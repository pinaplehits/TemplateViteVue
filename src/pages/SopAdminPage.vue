<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import GenericAutocomplete from '@components/GenericAutocomplete.vue'
  import GenericForm from '@components/GenericForm.vue'
  import router from '@router/index.js'

  const currentItem = ref({ assemblyDellSop: {} })
  const loading = ref(false)
  const showForm = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDelete = 'AssemblyDell/DeleteSop'
  const endpointGet = 'AssemblyDell/GetSops'

  const dataTable = ref({
    items: [],
    headers: [],
    title: 'SOPs Management',
    subtitle:
      'Manage and organize Standard Operating Procedures for Assembly Dell projects',
    textAddButton: 'Create project'
  })

  const area = ref({
    items: [],
    itemTitle: 'Area',
    itemValue: 'id',
    rules: [(v) => !!v || 'Area is required'],
    label: 'Areas',
    endpoint: 'AssemblyDell/GetAreas'
  })

  const model = ref({
    items: [],
    itemValue: 'id',
    rules: [(v) => !!v || 'Model is required'],
    label: 'Models',
    endpoint: 'AssemblyDell/GetModels'
  })

  const line = ref({
    items: [],
    itemTitle: 'Name',
    itemValue: 'id',
    rules: [
      (v) => !!v || 'At least one line is required',
      (v) => v.length > 0 || 'At least one line is required'
    ],
    label: 'Lines',
    endpoint: 'AssemblyDell/GetLines'
  })

  const form = ref({
    title: 'Create Project',
    buttonText: 'Create project',
    endpoint: 'AssemblyDell/CreateSop',
    data: {}
  })

  const handleModel = (value) => {
    model.value.items = value.items.map((item) => ({
      ...item,
      title: `${item.Model} - ${item.Platform}`
    }))
  }

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
  <GenericForm
    v-model:showForm="showForm"
    v-bind="form"
    @submit-success="loadData"
  >
    <v-text-field
      autofocus
      v-model="form.data.ProjectName"
      class="mx-4 mb-2"
      variant="solo"
      label="Project name"
      :rules="[(v) => !!v || 'Project name is required']"
    />
    <GenericAutocomplete
      class="mb-2"
      v-bind="model"
      @success="handleModel($event)"
      @input="(value) => (form.data.ModelId = value)"
    />
    <GenericAutocomplete
      class="mb-2"
      v-bind="area"
      @success="(value) => (area.items = value.items)"
      @input="(value) => (form.data.AreaId = value)"
    />
    <GenericAutocomplete
      v-bind="line"
      @success="(value) => (line.items = value.items)"
      @input="(value) => (form.data.LinesId = value)"
      chips
      multiple
    />
  </GenericForm>
  <DataManagementTable
    v-bind="dataTable"
    v-model:loading="loading"
    v-model:showForm="showForm"
    @delete-item="deleteItem"
    @detail-item="detailItem"
  />
</template>
