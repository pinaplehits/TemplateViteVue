<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'
  import apiClient from '@utils/axiosConfig.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DetailsSopTable from '@components/DetailsSopTable.vue'
  import UpdateProjectForm from '@components/UpdateProjectForm.vue'
  import { useRoute } from 'vue-router'

  const items = ref([])
  const headers = ref([])
  const stations = ref([])
  const currentItem = ref({ assemblyDellStationSop: {} })
  const loading = ref(false)
  const showConfirmPassword = ref(false)

  const idSop = ref(useRoute().params.id)

  const endpointAddStationToSop = 'AssemblyDell/AddStationToSop'
  const endpointDelete = 'AssemblyDell/DeleteStationInSop'
  const endpointGetStationsNotInSop = `AssemblyDell/GetStationsNotInSop/${idSop.value}`
  const endpointGetStationsInSop = `AssemblyDell/GetSopDetails/${idSop.value}`

  const getStationsInSop = async () => {
    const response = await populateAdminTable(endpointGetStationsInSop)

    if (!response.headers) return

    items.value = response.items
    headers.value = response.headers

    const fileTransferActions = [
      { title: 'Download', key: 'Download' },
      { title: 'Upload', key: 'Upload' }
    ]

    const actionsIndex = headers.value.findIndex(
      (header) => header.title === 'Actions'
    )

    if (actionsIndex !== -1) {
      headers.value.splice(actionsIndex, 0, ...fileTransferActions)
      return
    }

    headers.value.push(...fileTransferActions)
  }

  const getStationsNotInSop = async () => {
    const response = await apiClient.get(endpointGetStationsNotInSop)

    if (!response.items) return

    stations.value = response.items
  }

  const loadData = async () => {
    loading.value = true
    try {
      await Promise.all([getStationsInSop(), getStationsNotInSop()])
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentItem.value.assemblyDellStationSop.idStation = item
    currentItem.value.assemblyDellStationSop.idSop = idSop.value
    showConfirmPassword.value = true
  }

  onMounted(loadData)
</script>

<template>
  <ConfirmPassword
    v-model:showDialog="showConfirmPassword"
    :endpoint="endpointDelete"
    :data="currentItem"
    @success="loadData"
  />
  <!-- <UpdateProjectForm
    :sop-details="items"
    @success="loadData"
  /> -->
  <DetailsSopTable
    :items="items"
    :headers="headers"
    :stations="stations"
    :endpoint-add-station="endpointAddStationToSop"
    :id-sop="idSop"
    text-add-button="Add station"
    v-model:loading="loading"
    @delete-item="deleteItem"
    @add-station-success="loadData"
    @upload-file-success="loadData"
  />
</template>
