<script setup>
  import { ref, onMounted, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'

  const model = ref(null)

  const emit = defineEmits(['success', 'input'])

  const loading = defineModel('loading', { type: Boolean, default: false })
  const items = defineModel('items', { type: Array, default: [] })

  const props = defineProps({
    itemTitle: { type: String, default: 'title' },
    itemValue: { type: String, default: 'id' },
    rules: { type: Array, default: () => [] },
    label: { type: String, required: true },
    endpoint: { type: String, required: true },
    multiple: { type: Boolean, default: false }
  })

  const loadData = async () => {
    loading.value = true
    try {
      const response = await apiClient.get(props.endpoint)
      items.value = response.items

      emit('success', response)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  onMounted(loadData)

  watch(model, () => {
    emit('input', model.value)
  })
</script>

<template>
  <v-autocomplete
    class="mx-4"
    variant="solo"
    :disabled="loading"
    :loading="loading"
    v-model="model"
    :items="items"
    :item-title="props.itemTitle"
    :item-value="props.itemValue"
    :label="props.label"
    :rules="props.rules"
    :multiple="props.multiple"
  />
</template>
