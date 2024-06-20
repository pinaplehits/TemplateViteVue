<script setup>
  import { ref, onMounted } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { convertDateProperties } from '@utils/dateUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'
  import DataManagementTable from '@components/DataManagementTable.vue'
  import CreateLineForm from '@components/CreateLineForm.vue'

  const items = ref([])
  const headers = ref([])
  const currentItem = ref({ assemblyDellLine: {} })
  const loading = ref(false)
  const showCreate = ref(false)
  const showConfirmPassword = ref(false)

  const endpointDelete = 'AssemblyDell/DeleteLine'
  const endpointGet = 'AssemblyDell/GetLines'

  const populateTable = async () => {
    try {
      const { data } = await apiClient.get(endpointGet)

      items.value = convertDateProperties(data)

      headers.value = data.headers.filter((header) => header.visible === true)
      headers.value.push({ title: 'Actions', key: 'Actions' })
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
    currentItem.value.assemblyDellLine.id = item
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
  <CreateLineForm
    v-model:showForm="showCreate"
    @success="loadData"
  />
  <DataManagementTable
    :items="items"
    :headers="headers"
    text-add-button="Create line"
    v-model:loading="loading"
    v-model:showForm="showCreate"
    @delete-item="deleteItem"
  />
</template>
