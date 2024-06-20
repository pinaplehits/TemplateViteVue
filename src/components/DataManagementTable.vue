<script setup>
  import { ref, watch } from 'vue'

  const loading = defineModel('loading', { type: Boolean, required: true })
  const showForm = defineModel('showForm', { type: Boolean, required: true })

  const emit = defineEmits(['deleteItem', 'detailItem'])

  const props = defineProps({
    items: { type: Array, required: true },
    headers: { type: Array, required: true },
    textAddButton: { type: String, default: 'Add' }
  })

  const sortBy = ref([])
  const selected = ref([])
  const search = ref('')
  const searchFocused = ref(false)

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

  watch(search, () => {
    selected.value = []
  })
</script>

<template>
  <v-container fill-height>
    <v-card>
      <v-container>
        <v-row align="center">
          <v-col>
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
              style="max-width: 500px"
              hide-details
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click.stop="showForm = true"
              :text="props.textAddButton"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-divider />
      <v-data-table
        :items="props.items"
        :headers="props.headers"
        :loading="loading"
        :search="search"
        :sort-by="sortBy"
        v-model="selected"
        hover
        show-select
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
          <tr
            @click="() => emit('detailItem', item.id)"
            class="cursor-pointer"
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
                    class="delete-icon mdi-checkbox-blank-outline"
                    @click.stop="() => emit('deleteItem', item.id)"
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
    height: calc(98vh - 165px);
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
