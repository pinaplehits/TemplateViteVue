<script setup>
  import { onMounted, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const endpoint = 'Dell/Sop/AssemblyLine/Get'

  const loading = defineModel('loading', { type: Boolean, default: false })
  const items = defineModel('items', { type: Array, default: [] })
  const reload = defineModel('reload', { type: Boolean, default: false })

  const loadData = async () => {
    loading.value = true
    try {
      const response = await apiClient.get(endpoint)
      items.value = response.items
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
    :rules="[
      (v) => !!v || 'At least one line is required',
      (v) => v.length > 0 || 'At least one line is required'
    ]"
    label="Lines"
    item-title="Name"
    chips
    multiple
  />
</template>
