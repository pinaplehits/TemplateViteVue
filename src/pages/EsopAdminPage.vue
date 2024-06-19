<script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { convertDateProperties } from '@utils/dateUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import CreateProjectForm from '@components/CreateProjectForm.vue'

  const search = ref('')
  const searchFocused = ref(false)
  const loading = ref(false)

  const itemsSop = ref([])
  const headersSop = ref([])
  const currentSop = ref({ assemblyDell: {} })

  const endpointDeleteSops = 'AssemblyDell/DeleteSop'
  const endpointGetSops = 'AssemblyDell/GetSops'

  const showCreateProject = ref(false)

  const showConfirmPassword = ref(false)

  const getSops = async () => {
    try {
      const { data } = await apiClient.get(endpointGetSops)

      itemsSop.value = convertDateProperties(data)

      headersSop.value = data.headers.filter(
        (header) => header.visible === true
      )
      headersSop.value.push({ title: 'Actions', key: 'Actions' })
    } catch (error) {
      itemsSop.value = []
      headersSop.value = []

      throw new Error(error)
    }
  }

  const loadData = async () => {
    loading.value = true
    try {
      await Promise.all([getSops()])
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentSop.value.assemblyDell.id = item
    showConfirmPassword.value = true
  }

  onMounted(loadData)
</script>

<template>
  <ConfirmPassword
    v-model:showDialog="showConfirmPassword"
    :endpoint="endpointDeleteSops"
    :data="currentSop"
    @success="loadData"
  />
  <CreateProjectForm
    v-model:showCreateProject="showCreateProject"
    @success="loadData"
  />
  <v-container fill-height>
    <v-card>
      <v-container>
        <v-row align="center">
          <v-col>
            <v-text-field
              v-model="search"
              density="compact"
              label="Search"
              :prepend-inner-icon="searchFocused ? '' : 'mdi-magnify'"
              single-line
              variant="outlined"
              flat
              color="primary"
              class="my-1"
              style="max-width: 500px"
              hide-details
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click.stop="showCreateProject = true"
              text="Create project"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-divider />
      <DataManagementTable
        :items="itemsSop"
        :headers="headersSop"
        v-model:loading="loading"
        v-model:search="search"
        @delete-item="deleteItem"
      />
    </v-card>
  </v-container>
</template>
