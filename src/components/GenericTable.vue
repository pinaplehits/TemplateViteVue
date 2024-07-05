<script setup>
  import { ref, onMounted, watch, inject } from 'vue'
  import { populateAdminTable } from '@utils/tableUtils'

  const loading = ref(false)

  const emit = defineEmits(['deleteItem'])

  const search = defineModel('search', { type: String, default: '' })
  const sortBy = defineModel('sortBy', {
    type: Array,
    default: () => [{ key: 'Station', order: 'asc' }]
  })
  const selected = defineModel('selected', { type: Array, default: () => [] })
  const items = defineModel('items', { type: Array, default: () => [] })
  const headers = defineModel('headers', { type: Array, default: () => [] })
  const reload = defineModel('reload', { type: Boolean, default: false })

  const props = defineProps({
    classDataTable: { type: String, default: 'pa-2' },
    classTr: { type: String, default: '' },
    density: { type: String, default: 'default' },
    endpoint: { type: String, required: true },
    actions: {
      type: Array,
      default: () => ['Actions', 'Upload', 'Download', 'Images']
    },
    addHeaders: { type: Array, default: () => [{}] }
  })

  const loadData = async () => {
    loading.value = true

    try {
      const response = await populateAdminTable(props.endpoint)

      if (!response.headers) return

      items.value = response.items
      headers.value = response.headers

      const actionsIndex = headers.value.findIndex(
        (header) => header.title === 'Actions'
      )

      if (actionsIndex !== -1) {
        headers.value.splice(actionsIndex, 0, ...props.addHeaders)
        return
      }

      headers.value.push(...props.addHeaders)
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      reload.value = false
    }
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

  const handleDetailItem = inject('handleDetailItem', () => {})
  const emitDetailItem = (item) => handleDetailItem(item)

  onMounted(loadData)

  watch(reload, (newValue) => {
    if (newValue) loadData()
  })
</script>

<template>
  <v-data-table
    :items="items"
    :headers="headers"
    :loading="loading"
    :search="search"
    :sort-by="sortBy"
    v-model="selected"
    hover
    show-select
    fixed-header
    items-per-page="-1"
    hide-default-footer
    :density="props.density"
    return-object
    :class="props.classDataTable"
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
          <template v-else-if="props.actions.includes(column.key)">
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
      <tr
        @click="emitDetailItem(item)"
        :class="props.classTr"
      >
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
                class="delete-icon"
                @click.stop="() => emit('deleteItem', item.id)"
              >
                mdi-delete
              </v-icon>
            </td>
          </template>
          <template v-else-if="column.key === 'Images'">
            <slot
              name="images"
              :item="item"
            />
          </template>
          <template v-else-if="column.key === 'Upload'">
            <slot
              name="upload"
              :item="item"
            />
          </template>
          <template v-else-if="column.key === 'Download'">
            <slot
              name="download"
              :item="item"
            />
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
</template>

<style scoped>
  .v-data-table {
    height: calc(91vh - 145px);
  }

  :deep(th) {
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

  .delete-icon {
    color: maroon;
    transition:
      background-color 0.3s,
      border-radius 0.3s,
      padding 0.3s;
    padding: var(--delete-icon-padding, 7px);
    box-sizing: content-box;
  }

  .delete-icon:hover {
    background-color: rgba(0, 0, 0, 0.06);
    border-radius: 100%;
  }
</style>
