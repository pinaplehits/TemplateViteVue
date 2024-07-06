<script setup>
  import { ref, provide } from 'vue'
  import router from '@router/index.js'
  import AdminTemplate from '@components/AdminTemplate.vue'
  import LineAutocomplete from '@components/LineAutocomplete.vue'
  import ModelAutocomplete from '@components/ModelAutocomplete.vue'
  import AreaAutocomplete from '@components/AreaAutocomplete.vue'

  const data = ref({
    title: 'SOPs Management',
    subtitle:
      'Manage and organize Standard Operating Procedures for Assembly Dell projects',
    textAddButton: 'Create project',
    titleForm: 'Create Project',
    textFormButton: 'Create project',
    formInputs: {},
    endpointGet: 'Dell/Sop/AssemblySop/Get',
    endpointDelete: 'Dell/Sop/AssemblySop/Delete',
    endpointCreate: 'Dell/Sop/AssemblySop/Create'
  })

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
    <ModelAutocomplete
      v-model="data.formInputs.ModelId"
      class="mb-2"
    />
    <AreaAutocomplete
      v-model="data.formInputs.AreaId"
      class="mb-2"
    />
    <LineAutocomplete
      v-model="data.formInputs.LinesId"
      chips
      multiple
      :rules="[
        (v) => !!v || 'At least one line is required',
        (v) => v.length > 0 || 'At least one line is required'
      ]"
    />
  </AdminTemplate>
</template>
