<script setup>
  import { ref, provide } from 'vue'
  import router from '@router/index.js'
  import AdminTemplate from '@components/AdminTemplate.vue'
  import GenericAutocomplete from '@components/GenericAutocomplete.vue'

  const data = ref({
    title: 'SOPs Management',
    subtitle:
      'Manage and organize Standard Operating Procedures for Assembly Dell projects',
    textAddButton: 'Create project',
    titleForm: 'Create Project',
    textFormButton: 'Create project',
    formInputs: {},
    endpointGet: 'AssemblyDell/GetSops',
    endpointDelete: 'AssemblyDell/DeleteSop',
    endpointCreate: 'AssemblyDell/CreateSop'
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

  const handleModel = (value) => {
    model.value.items = value.items.map((item) => ({
      ...item,
      title: `${item.Model} - ${item.Platform}`
    }))
  }

  const handleDetailItem = (item) => {
    router.push({ name: 'SOP details', params: { id: item.id } })
  }

  provide('handleDetailItem', handleDetailItem)
</script>

<template>
  <AdminTemplate v-bind="data">
    <v-text-field
      autofocus
      v-model="data.formInputs.ProjectName"
      class="mx-4 mb-2"
      variant="solo"
      label="Project name"
      :rules="[(v) => !!v || 'Project name is required']"
    />
    <GenericAutocomplete
      class="mb-2"
      v-bind="model"
      @success="handleModel($event)"
      @input="data.formInputs.ModelId = $event"
    />
    <GenericAutocomplete
      class="mb-2"
      v-bind="area"
      @success="area.items = $event.items"
      @input="data.formInputs.AreaId = $event"
    />
    <GenericAutocomplete
      v-bind="line"
      @success="line.items = $event.items"
      @input="data.formInputs.LinesId = $event"
      chips
      multiple
    />
  </AdminTemplate>
</template>
