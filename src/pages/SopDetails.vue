<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import apiClient from '@utils/axiosConfig.js'
  import GenericForm from '@components/GenericForm.vue'
  import LineAutocomplete from '@components/LineAutocomplete.vue'
  import ModelAutocomplete from '@components/ModelAutocomplete.vue'
  import AreaAutocomplete from '@components/AreaAutocomplete.vue'
  import DetailsTemplate from '@components/DetailsTemplate.vue'

  const loading = ref(false)
  const project = ref([])
  const idSop = useRoute().params.id
  const showEditForm = ref(false)

  const data = ref({
    idSop,
    textAddButton: 'Add station',
    endpointGet: `Dell/Sop/AssemblySop/GetDetails/${idSop}`,
    endpointDelete: 'Dell/Sop/AssemblyStation/DeleteInSop',
    endpointUpdate: '',
    endpointAddStation: 'Dell/Sop/AssemblyStation/AddToSop'
  })

  const editForm = ref({
    title: 'Update Project',
    buttonText: 'Update project',
    endpoint: 'Dell/Sop/AssemblySop/Update',
    data: {}
  })

  const endpointGet = `Dell/Sop/AssemblySop/GetById/${idSop}`

  const getProjectInfo = async () => {
    const { items } = await apiClient.get(endpointGet)

    project.value = items[0]
  }

  const loadData = async () => {
    loading.value = true
    try {
      await Promise.all([getProjectInfo()])
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  onMounted(loadData)

  watch(showEditForm, (newValue) => {
    if (newValue) {
      editForm.value.data.ProjectName = project.value.Project
      editForm.value.data.ModelId = project.value.idModel
      editForm.value.data.AreaId = project.value.idArea
      editForm.value.data.LinesId = project.value.idLine.split(',').map(Number)
    }
  })
</script>

<template>
  <GenericForm
    v-bind="editForm"
    v-model:showForm="showEditForm"
    @submit-success="reload = true"
  >
    <v-text-field
      autofocus
      v-model="editForm.data.ProjectName"
      class="mx-4 mb-2"
      variant="solo"
      label="Project name"
      :rules="[(v) => !!v || 'Project name is required']"
    />
    <ModelAutocomplete
      v-model="editForm.data.ModelId"
      class="mb-2"
    />
    <AreaAutocomplete
      v-model="editForm.data.AreaId"
      class="mb-2"
    />
    <LineAutocomplete v-model="editForm.data.LinesId" />
  </GenericForm>
  <DetailsTemplate v-bind="data">
    <template #info>
      <v-card class="mb-4">
        <v-container class="mt-n2">
          <v-row>
            <v-col>
              <v-card-title>{{ project.Project }}</v-card-title>
              <v-card-subtitle>Project name</v-card-subtitle>
            </v-col>
            <v-col>
              <v-card-title>{{ project.Model }}</v-card-title>
              <v-card-subtitle>Model</v-card-subtitle>
            </v-col>
            <v-col>
              <v-card-title>{{ project.Area }}</v-card-title>
              <v-card-subtitle>Area</v-card-subtitle>
            </v-col>
            <v-col>
              <v-card-title>{{ project.Lines }}</v-card-title>
              <v-card-subtitle>Lines</v-card-subtitle>
            </v-col>
            <v-col class="d-flex justify-end align-center">
              <v-btn
                @click.stop="showEditForm = true"
                text="Edit project"
                prepend-icon="mdi-pencil-outline"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </template>
  </DetailsTemplate>
</template>
