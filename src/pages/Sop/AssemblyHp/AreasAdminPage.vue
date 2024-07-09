<script setup>
  import { ref, provide } from 'vue'
  import AdminTemplate from '@components/AssemblyHp/AdminTemplate.vue'
  import GenericForm from '@components/AssemblyHp/GenericForm.vue'

  const showEditForm = ref(false)
  const reload = ref(false)

  const data = ref({
    title: 'Areas Management',
    subtitle: 'Manage and organize area for Assembly HP projects',
    textAddButton: 'Create area',
    titleForm: 'Create Area',
    textFormButton: 'Create area',
    formInputs: {},
    endpointGet: 'Hp/Sop/AssemblyHpArea/Get',
    endpointDelete: 'Hp/Sop/AssemblyHpArea/Delete',
    endpointCreate: 'Hp/Sop/AssemblyHpArea/Create'
  })

  const editForm = ref({
    title: 'Update Area',
    buttonText: 'Update area',
    endpoint: 'Hp/Sop/AssemblyHpArea/Update',
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
