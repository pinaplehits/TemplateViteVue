<script setup>
  import { ref, provide } from 'vue'
  import AdminTemplate from '@components/AdminTemplate.vue'
  import GenericForm from '@components/GenericForm.vue'

  const showEditForm = ref(false)
  const reload = ref(false)

  const data = ref({
    title: 'Stations Management',
    subtitle: 'Manage and organize station for Assembly Dell projects',
    textAddButton: 'Create station',
    titleForm: 'Create Station',
    textFormButton: 'Create station',
    formInputs: {},
    endpointGet: 'AssemblyDell/GetStations',
    endpointDelete: 'AssemblyDell/DeleteStation',
    endpointCreate: 'AssemblyDell/CreateStation'
  })

  const editForm = ref({
    title: 'Update Station',
    buttonText: 'Update station',
    endpoint: 'AssemblyDell/UpdateStation',
    data: {}
  })

  const handleDetailItem = (item) => {
    editForm.value.data.id = item.id
    editForm.value.data.StationName = item.Station
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
      v-model="editForm.data.StationName"
      class="mx-4"
      variant="solo"
      label="Station name"
      :rules="[(value) => !!value || 'Station name is required']"
    />
  </GenericForm>
  <AdminTemplate v-bind="data">
    <v-text-field
      autofocus
      v-model="data.formInputs.StationName"
      class="mx-4"
      variant="solo"
      label="Station name"
      :rules="[(value) => !!value || 'Station name is required']"
    />
  </AdminTemplate>
</template>
