<script setup>
  import { ref, provide } from 'vue'
  import AdminTemplate from '@components/AdminTemplate.vue'
  import GenericForm from '@components/GenericForm.vue'

  const showEditForm = ref(false)
  const reload = ref(false)

  const data = ref({
    title: 'Models Management',
    subtitle: 'Manage and organize model for Assembly Dell projects',
    textAddButton: 'Create model',
    titleForm: 'Create Model',
    textFormButton: 'Create model',
    formInputs: {},
    endpointGet: 'Dell/Sop/AssemblyModel/Get',
    endpointDelete: 'Dell/Sop/AssemblyModel/Delete',
    endpointCreate: 'Dell/Sop/AssemblyModel/Create'
  })

  const editForm = ref({
    title: 'Update Model',
    buttonText: 'Update model',
    endpoint: 'Dell/Sop/AssemblyModel/Update',
    data: {}
  })

  const handleDetailItem = (item) => {
    editForm.value.data.id = item.id
    editForm.value.data.ModelName = item.Model
    editForm.value.data.Platform = item.Platform
    showEditForm.value = true
  }

  provide('handleDetailItem', handleDetailItem)
</script>

<template>
  <GenericForm
    v-model:showForm="showEditForm"
    v-bind="editForm"
    @submit-success="reload = true"
  >
    <v-text-field
      autofocus
      v-model="editForm.data.ModelName"
      class="mx-4 mb-2"
      variant="solo"
      label="Model name"
      :rules="[(value) => !!value || 'Model name is required']"
    />
    <v-text-field
      v-model="editForm.data.Platform"
      class="mx-4"
      variant="solo"
      label="Platform name"
      :rules="[(value) => !!value || 'Platform name is required']"
    />
  </GenericForm>
  <AdminTemplate
    v-bind="data"
    v-model:reload="reload"
  >
    <v-text-field
      autofocus
      v-model="data.formInputs.ModelName"
      class="mx-4 mb-2"
      variant="solo"
      label="Model name"
      :rules="[(value) => !!value || 'Model name is required']"
    />
    <v-text-field
      v-model="data.formInputs.Platform"
      class="mx-4"
      variant="solo"
      label="Platform name"
      :rules="[(value) => !!value || 'Platform name is required']"
    />
  </AdminTemplate>
</template>
