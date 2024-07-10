<script setup>
  import { onMounted, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const endpoint = 'Hp/Sop/AssemblyHpArea/Get'

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
    item-title="Area"
    :rules="[(v) => !!v || 'Area is required']"
    label="Areas"
  />
</template>
