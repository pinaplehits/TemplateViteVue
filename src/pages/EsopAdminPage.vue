<script setup>
  import { ref, onMounted, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { convertDateProperties } from '@utils/dateUtils.js'

  const search = ref('')
  const searchFocused = ref(false)
  const selected = ref([])
  const loading = ref(false)
  const items = ref([])
  const headers = ref([])

  const loadData = async () => {
    try {
      loading.value = true
      const { data } = await apiClient.get('AssemblyDell/GetEsop')

      items.value = convertDateProperties(data)

      headers.value = data.headers.filter((header) => header.visible === true)
      headers.value.push({ title: 'Actions', key: 'Actions' })
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    console.log(item)
  }

  onMounted(() => {
    loadData()
  })

  watch(search, () => {
    selected.value = []
  })
</script>

<template>
  <v-container fill-height>
    <v-card>
      <v-card-title>
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
          style="width: 400px"
          hide-details
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        />
      </v-card-title>
      <v-divider />
      <v-data-table
        :items="items"
        :headers="headers"
        :loading="loading"
        :search="search"
        hover
        show-select
        v-model="selected"
        fixed-header
        class="full-height-table"
        items-per-page="-1"
        hide-default-footer
        density="compact"
        return-object
      >
        <template #loading>
          <v-skeleton-loader type="table-row-divider@10" />
        </template>
        <template #headers="{ columns, allSelected, selectAll, someSelected }">
          <tr>
            <template
              v-for="column in columns"
              :key="column.key"
            >
              <th style="font-weight: bold; background-color: lavender">
                <template v-if="column.value === 'data-table-select'">
                  <v-checkbox-btn
                    :indeterminate="someSelected && !allSelected"
                    :model-value="allSelected"
                    color="primary"
                    @update:model-value="selectAll(!allSelected)"
                  />
                </template>
                <template v-else>
                  {{ column.title }}
                </template>
              </th>
            </template>
          </tr>
        </template>
        <template #item="{ item, columns }">
          <tr @click="() => console.log(item.id)">
            <template
              v-for="column in columns"
              :key="column.key"
            >
              <template v-if="column.key === 'data-table-select'">
                <td style="width: 0px">
                  <v-checkbox-btn
                    v-model="selected"
                    :value="item"
                    color="primary"
                    @click.stop
                  />
                </td>
              </template>
              <template v-else-if="column.key !== 'Actions'">
                <td>
                  {{ item[column.key] }}
                </td>
              </template>
              <template v-else>
                <td style="text-align: center; width: 0px">
                  <v-icon
                    size="small"
                    style="color: maroon"
                    @click.stop="deleteItem(item)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </template>
            </template>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<style scoped>
  .full-height-table {
    height: calc(100vh - 165px);
  }
</style>
