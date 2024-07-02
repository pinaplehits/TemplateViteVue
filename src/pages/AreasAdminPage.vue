<script setup>
  import { ref, provide } from 'vue'
  import AdminTemplate from '@components/AdminTemplate.vue'
  import GenericForm from '@components/GenericForm.vue'

  const showEditForm = ref(false)
  const reload = ref(false)

  const data = ref({
    title: 'Areas Management',
    subtitle: 'Manage and organize area for Assembly Dell projects',
    textAddButton: 'Create area',
    titleForm: 'Create Area',
    textFormButton: 'Create area',
    formInputs: {},
    endpointGet: 'AssemblyDell/GetAreas',
    endpointDelete: 'AssemblyDell/DeleteArea',
    endpointCreate: 'AssemblyDell/CreateArea'
  })

  const editForm = ref({
    title: 'Update Area',
    buttonText: 'Update area',
    endpoint: 'AssemblyDell/UpdateArea',
    data: {}
  })

  const handleDetailItem = (item) => {
    editForm.value.data.id = item.id
    editForm.value.data.AreaName = item.Area
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
      v-model="editForm.data.AreaName"
      class="mx-4"
      variant="solo"
      label="Area name"
      :rules="[(value) => !!value || 'Area name is required']"
    />
  </GenericForm>
  <AdminTemplate
    v-bind="data"
    v-model:reload="reload"
  >
    <v-text-field
      autofocus
      v-model="data.formInputs.AreaName"
      class="mx-4"
      variant="solo"
      label="Area name"
      :rules="[(value) => !!value || 'Area name is required']"
    />
  </AdminTemplate>
</template>
