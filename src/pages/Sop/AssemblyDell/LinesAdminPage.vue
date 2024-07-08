<script setup>
  import { ref, provide } from 'vue'
  import AdminTemplate from '@components/AdminTemplate.vue'
  import GenericForm from '@components/GenericForm.vue'

  const showEditForm = ref(false)
  const reload = ref(false)

  const data = ref({
    title: 'Lines Management',
    subtitle: 'Manage and organize line for Assembly Dell projects',
    textAddButton: 'Create ine',
    titleForm: 'Create Line',
    textFormButton: 'Create line',
    formInputs: {},
    endpointGet: 'Dell/Sop/AssemblyLine/Get',
    endpointDelete: 'Dell/Sop/AssemblyLine/Delete',
    endpointCreate: 'Dell/Sop/AssemblyLine/Create'
  })

  const editForm = ref({
    title: 'Update Line',
    buttonText: 'Update line',
    endpoint: 'Dell/Sop/AssemblyLine/Update',
    data: {}
  })

  const handleDetailItem = (item) => {
    editForm.value.data.id = item.id
    editForm.value.data.LineName = item.Name
    editForm.value.data.Type = item.Type
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
      v-model="editForm.data.LineName"
      class="mx-4"
      variant="solo"
      label="Line name"
      :rules="[(value) => !!value || 'Line name is required']"
    />
    <v-text-field
      v-model="editForm.data.Type"
      class="mx-4"
      variant="solo"
      label="Type"
      :rules="[(value) => !!value || 'Type is required']"
    />
  </GenericForm>
  <AdminTemplate
    v-bind="data"
    v-model:reload="reload"
  >
    <v-text-field
      autofocus
      v-model="data.formInputs.LineName"
      class="mx-4"
      variant="solo"
      label="Line name"
      :rules="[(value) => !!value || 'Line name is required']"
    />
    <v-text-field
      v-model="data.formInputs.Type"
      class="mx-4"
      variant="solo"
      label="Type"
      :rules="[(value) => !!value || 'Type is required']"
    />
  </AdminTemplate>
</template>
