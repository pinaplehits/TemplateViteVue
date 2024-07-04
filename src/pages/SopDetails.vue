<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import apiClient from '@utils/axiosConfig.js'
  import DetailsTemplate from '@components/DetailsTemplate.vue'

  const loading = ref(false)
  const project = ref([])
  const idSop = useRoute().params.id

  const data = ref({
    idSop,
    textAddButton: 'Add station',
    titleForm: 'Update Project',
    textFormButton: 'Update project',
    formInputs: {},
    endpointGet: `AssemblyDell/GetSopDetails/${idSop}`,
    endpointDelete: 'AssemblyDell/DeleteStationInSop',
    endpointUpdate: '',
    endpointAddStation: 'AssemblyDell/AddStationToSop'
  })

  const endpointGet = `AssemblyDell/GetSopById/${idSop}`

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
</script>

<template>
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
