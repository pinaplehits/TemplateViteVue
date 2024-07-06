<script setup>
  import { onMounted, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { sortDataByKey } from '@utils/sortUtils.js'

  const props = defineProps({
    endpoint: { type: String, required: true }
  })

  const loading = defineModel('loading', { type: Boolean, default: false })
  const items = defineModel('items', { type: Array, default: [] })
  const reload = defineModel('reload', { type: Boolean, default: false })

  const loadData = async () => {
    loading.value = true
    try {
      const response = await apiClient.get(props.endpoint)
      items.value = sortDataByKey(response.items, 'Station')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      reload.value = false
    }
  }

  onMounted(loadData)

  watch(reload, (newValue) => {
    if (newValue) loadData()
  })
</script>

<template>
  <v-autocomplete
    class="mx-4"
    variant="solo"
    :disabled="loading"
    :loading="loading"
    :items="items"
    item-value="id"
    item-title="Station"
    label="Stations"
  />
</template>
