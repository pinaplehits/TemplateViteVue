<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import apiClient from '@utils/axiosConfig.js'
  import GenericForm from '@components/Sop/AssemblyHp/GenericForm.vue'
  import LineAutocomplete from '@components/Sop/AssemblyHp/LineAutocomplete.vue'
  import ModelAutocomplete from '@components/Sop/AssemblyHp/ModelAutocomplete.vue'
  import DetailsTemplate from '@components/Sop/AssemblyHp/DetailsTemplate.vue'

  const loading = ref(false)
  const project = ref([])
  const idSop = useRoute().params.id
  const showEditForm = ref(false)
  const reload = ref(false)

  const data = ref({
    idSop,
    textAddButton: 'Add station',
    endpointGet: `Hp/Sop/AssemblyHpSop/GetDetails/${idSop}`,
    endpointDelete: 'Hp/Sop/AssemblyHpStation/DeleteInSop',
    endpointUpdate: '',
    endpointAddStation: 'Hp/Sop/AssemblyHpStation/AddToSop'
  })

  const editForm = ref({
    title: 'Update Project',
    buttonText: 'Update project',
    endpoint: 'Hp/Sop/AssemblyHpSop/Update',
    data: {}
  })

  const endpointGet = `Hp/Sop/AssemblyHpSop/GetById/${idSop}`

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
      reload.value = false
    }
  }

  onMounted(loadData)

  watch(showEditForm, (newValue) => {
    if (newValue) {
      editForm.value.data.SopId = idSop
      editForm.value.data.ProjectName = project.value.Project
      editForm.value.data.ModelId = project.value.idModel
      editForm.value.data.LinesId = project.value.idLine.split(',').map(Number)
    }
  })

  watch(reload, (newValue) => {
    if (newValue) loadData()
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
    <LineAutocomplete
      v-model="editForm.data.LinesId"
      chips
      multiple
      :rules="[
        (v) => !!v || 'At least one line is required',
        (v) => v.length > 0 || 'At least one line is required'
      ]"
    />
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
