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
  const loadingCreateForm = ref(false)
  const form = ref(null)

  const itemsSop = ref([])
  const headersSop = ref([])
  const currentSop = ref({ assemblyDell: {} })

  const itemsModel = ref([])
  const itemsArea = ref([])
  const itemsLine = ref([])

  const endpointDeleteSops = 'AssemblyDell/DeleteSop'
  const endpointGetSops = 'AssemblyDell/GetSops'
  const endpointGetModels = 'AssemblyDell/GetModels'
  const endpointGetAreas = 'AssemblyDell/GetAreas'
  const endpointGetLines = 'AssemblyDell/GetLines'
  const endpointCreateSop = 'AssemblyDell/CreateSop'

  const showCreateProject = ref(false)
  const currentProjectName = ref('')
  const currentModel = ref('')
  const currentArea = ref('')
  const currentLines = ref([])

  const showConfirmPassword = ref(false)

  const getSops = async () => {
    try {
      const { data } = await apiClient.get(endpointGetSops)

      itemsSop.value = convertDateProperties(data)

      headersSop.value = data.headers.filter(
        (header) => header.visible === true
      )
      headersSop.value.push({ title: 'Actions', key: 'Actions' })
    } catch (error) {
      itemsSop.value = []
      headersSop.value = []

      throw new Error(error)
    }
  }

  const getModels = async () => {
    try {
      const { data } = await apiClient.get(endpointGetModels)

      itemsModel.value = data.items.map((item) => ({
        ...item,
        title: `${item.Model} - ${item.Description}`
      }))
    } catch (error) {
      itemsModel.value = []

      throw new Error(error)
    }
  }

  const getAreas = async () => {
    try {
      const { data } = await apiClient.get(endpointGetAreas)

      itemsArea.value = data.items
    } catch (error) {
      itemsArea.value = []

      throw new Error(error)
    }
  }

  const getLines = async () => {
    try {
      const { data } = await apiClient.get(endpointGetLines)

      itemsLine.value = data.items
    } catch (error) {
      itemsLine.value = []

      throw new Error(error)
    }
  }

  const loadData = async () => {
    loading.value = true
    try {
      await Promise.all([getSops(), getModels(), getAreas(), getLines()])
    } catch (error) {
      console.error(error.message)
    } finally {
      loading.value = false
    }
  }

  const deleteItem = (item) => {
    currentSop.value.assemblyDell.id = item
    showConfirmPassword.value = true
  }

  const createProject = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    loadingCreateForm.value = true
    try {
      const data = {
        ProjectName: currentProjectName.value,
        ModelId: currentModel.value,
        AreaId: currentArea.value,
        LinesId: currentLines.value
      }

      await apiClient.post(endpointCreateSop, data)

      showCreateProject.value = false
      form.value.reset()

      try {
        loading.value = true
        await getSops()
      } finally {
        loading.value = false
      }
    } catch (error) {
      console.error(error)
    } finally {
      loadingCreateForm.value = false
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

  onMounted(loadData)

  watch(search, () => {
    selected.value = []
  })

  watch(showCreateProject, (newValue) => {
    if (!newValue) form.value.reset()
  })
</script>

<template>
  <ConfirmPassword
    v-model:showDialog="showConfirmPassword"
    :endpoint="endpointDeleteSops"
    :data="currentSop"
    @success="getSops"
  />
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
              @click.stop="showCreateProject = true"
              text="Create project"
            />
          </v-col>
        </v-row>
      </v-container>

      <v-dialog
        :persistent="loadingCreateForm"
        v-model="showCreateProject"
        max-width="600"
      >
        <v-card class="px-2 py-2">
          <v-card-title
            class="mb-n1"
            style="font-weight: bold"
          >
            Create new project
          </v-card-title>
          <v-card-subtitle class="mb-5">
            Please ensure all fields are filled out before proceeding.
          </v-card-subtitle>
          <v-form
            ref="form"
            @submit.prevent
          >
            <v-text-field
              autofocus
              v-model="currentProjectName"
              class="mx-4 mb-2"
              variant="solo"
              label="Project name"
              :rules="[(value) => !!value || 'Project name is required']"
              :disabled="loadingCreateForm"
            />
            <v-autocomplete
              v-model="currentModel"
              class="mx-4 mb-2"
              variant="solo"
              :items="itemsModel"
              item-value="id"
              label="Models"
              :rules="[(value) => !!value || 'Model is required']"
              :disabled="loadingCreateForm"
            />
            <v-autocomplete
              v-model="currentArea"
              class="mx-4 mb-2"
              variant="solo"
              :items="itemsArea"
              item-title="Area"
              item-value="id"
              label="Areas"
              :rules="[(value) => !!value || 'Area is required']"
              :disabled="loadingCreateForm"
            />
            <v-autocomplete
              v-model="currentLines"
              chips
              multiple
              class="mx-4"
              variant="solo"
              :items="itemsLine"
              item-title="Name"
              item-value="id"
              label="Lines"
              :rules="[
                (value) => value.length > 0 || 'At least one line is required'
              ]"
              :disabled="loadingCreateForm"
            />
            <v-card-actions class="justify-end">
              <v-btn
                :disabled="loadingCreateForm"
                text="Cancel"
                @click.stop="showCreateProject = false"
              />
              <v-btn
                text="Create project"
                :disabled="loadingCreateForm"
                :loading="loadingCreateForm"
                type="submit"
                @click.stop="createProject"
              />
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-divider />
      <v-data-table
        :items="itemsSop"
        :headers="headersSop"
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
</style>
