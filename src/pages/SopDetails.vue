<script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { convertDateProperties } from '@utils/dateUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DetailsSopTable from '@components/DetailsSopTable.vue'
  import CreateProjectForm from '@components/CreateProjectForm.vue'
  import UpdateProjectForm from '@components/UpdateProjectForm.vue'

  const items = ref([])
  const headers = ref([])
  const currentItem = ref({ assemblyDellSop: {} })
  const loading = ref(false)
  const showCreate = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDelete = 'AssemblyDell/DeleteStationInSop'
  const endpointGet = 'AssemblyDell/GetStations'

  const populateTable = async () => {
    try {
      const { data } = await apiClient.get(endpointGet)

      items.value = convertDateProperties(data)

      headers.value = data.headers.filter((header) => header.visible === true)

      headers.value.push({ title: 'Actions', key: 'Actions' })
      headers.value.push({ title: 'Upload', key: 'Upload' })
    } catch (error) {
      items.value = []
      headers.value = []

      throw new Error(error)
    }
  }

  const loadData = async () => {
    loading.value = true
    try {
      await Promise.all([populateTable()])
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentItem.value.assemblyDellSop.id = item
    showConfirmPassword.value = true
  }

  const detailItem = (item) => {
    console.log(item)
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
  <CreateProjectForm
    v-model:showForm="showCreate"
    @success="loadData"
  />
  <UpdateProjectForm @success="loadData" />
  <DetailsSopTable
    :items="items"
    :headers="headers"
    text-add-button="Add station"
    v-model:loading="loading"
    v-model:showForm="showCreate"
    @delete-item="deleteItem"
    @detail-item="detailItem"
  />
</template>
