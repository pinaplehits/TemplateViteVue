<script setup>
  import { ref, onMounted, watch } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { convertDateProperties } from '@utils/dateUtils.js'
  import ConfirmPassword from '@components/ConfirmPassword.vue'

  const sortBy = ref([])
  const search = ref('')
  const searchFocused = ref(false)
  const selected = ref([])
  const loading = ref(false)
  const items = ref([])
  const headers = ref([])
  const deleteEndpoint = 'AssemblyDell/DeleteSop'
  const getEndpoint = 'AssemblyDell/GetEsop'
  const currentItem = ref({ assemblyDell: {} })

  const showConfirmPassword = ref(false)

  const getSop = async () => {
    try {
      const { data } = await apiClient.get(getEndpoint)

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
      await getSop()
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentItem.value.assemblyDell.id = item
    showConfirmPassword.value = true
  }

  const toggleSort = (key) => {
    let order = 'asc'
    if (sortBy.value[0] && sortBy.value[0].key === key) {
      if (sortBy.value[0].order === 'asc') {
        order = 'desc'
      } else {
        sortBy.value = []
        return
      }
    }

    sortBy.value = [{ key, order }]
  }

  const sortIcon = (key) => {
    if (sortBy.value[0]?.key === key) {
      return sortBy.value[0]?.order === 'asc'
        ? 'mdi-arrow-up'
        : 'mdi-arrow-down'
    }

    return 'mdi-arrow-up'
  }

  onMounted(loadData)

  watch(search, () => {
    selected.value = []
  })
</script>

<template>
  <ConfirmPassword
    v-model:showDialog="showConfirmPassword"
    v-model:endpoint="deleteEndpoint"
    :data="currentItem"
    @success="getSop"
  />
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
        :sort-by="sortBy"
        hover
        show-select
        v-model="selected"
        fixed-header
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
              <template v-if="column.value === 'data-table-select'">
                <th>
                  <v-checkbox-btn
                    :indeterminate="someSelected && !allSelected"
                    :model-value="allSelected"
                    color="primary"
                    @update:model-value="selectAll(!allSelected)"
                    @click.stop
                  />
                </th>
              </template>
              <template v-else-if="column.key === 'Actions'">
                <th>
                  {{ column.title }}
                </th>
              </template>
              <template v-else>
                <th
                  class="header-no-wrap"
                  @click.stop="toggleSort(column.key)"
                >
                  {{ column.title }}
                  <v-icon
                    small
                    class="sort-icon"
                    :class="{ 'is-sorting': sortBy[0]?.key === column.key }"
                  >
                    {{ sortIcon(column.key) }}
                  </v-icon>
                </th>
              </template>
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
              <template v-else-if="column.key === 'Actions'">
                <td style="text-align: center; width: 0px">
                  <v-icon
                    size="small"
                    style="color: maroon"
                    @click.stop="deleteItem(item.id)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </template>
              <template v-else>
                <td>
                  {{ item[column.key] }}
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
  .v-data-table {
    height: calc(100vh - 165px);
  }

  :deep th {
    background-color: lavender !important;
    font-weight: bold !important;
  }

  .header-no-wrap {
    cursor: pointer;
    white-space: nowrap;
  }

  .header-no-wrap:hover .sort-icon:not(.is-sorting) {
    visibility: visible;
    opacity: 0.5;
  }

  .sort-icon {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .is-sorting {
    visibility: visible;
    opacity: 1;
  }
</style>
