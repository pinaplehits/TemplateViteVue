<script setup>
  import { ref, onMounted } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'
  import apiClient from '@utils/axiosConfig.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DetailsSopTable from '@components/DetailsSopTable.vue'
  import { useRoute } from 'vue-router'
  import { sortDataByKey } from '@utils/sortUtils.js'

  const currentItem = ref({ assemblyDellStationSop: {} })
  const loading = ref(false)
  const showConfirmPassword = ref(false)

  const dataTable = ref({
    items: [],
    headers: [],
    stations: [],
    idSop: useRoute().params.id,
    endpointAddStation: 'AssemblyDell/AddStationToSop',
    textAddButton: 'Add station'
  })

  const endpointDelete = 'AssemblyDell/DeleteStationInSop'
  const endpointGetStationsNotInSop = `AssemblyDell/GetStationsNotInSop/${dataTable.value.idSop}`
  const endpointGetStationsInSop = `AssemblyDell/GetSopDetails/${dataTable.value.idSop}`

  const getStationsInSop = async () => {
    const response = await populateAdminTable(endpointGetStationsInSop)

    if (!response.headers) return

    dataTable.value.items = response.items
    dataTable.value.headers = response.headers

    const fileTransferActions = [
      { title: 'Download', key: 'Download' },
      { title: 'Upload', key: 'Upload' }
    ]

    const actionsIndex = dataTable.value.headers.findIndex(
      (header) => header.title === 'Actions'
    )

    if (actionsIndex !== -1) {
      dataTable.value.headers.splice(actionsIndex, 0, ...fileTransferActions)
      return
    }

    dataTable.value.headers.push(...fileTransferActions)
  }

  const getStationsNotInSop = async () => {
    const response = await apiClient.get(endpointGetStationsNotInSop)

    if (!response.items) return

    dataTable.value.stations = sortDataByKey(response.items, 'Station')
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
    currentItem.value.assemblyDellStationSop.idSop = dataTable.value.idSop
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
  <DetailsSopTable
    v-bind="dataTable"
    v-model:loading="loading"
    @delete-item="deleteItem"
    @add-station-success="loadData"
    @upload-file-success="loadData"
  />
</template>
