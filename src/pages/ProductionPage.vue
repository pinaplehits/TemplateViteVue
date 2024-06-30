<script setup>
  import { ref, onMounted, watch, onUnmounted } from 'vue'
  import apiClient from '@utils/axiosConfig.js'
  import { useGlobalStore } from '@stores/globalStore.js'

  const currentArea = ref(null)
  const itemsArea = ref([])
  const currentLine = ref(null)
  const itemsLine = ref([])
  const currentStation = ref(null)
  const itemsStation = ref([])
  const loading = ref(false)
  const loadingSearch = ref(false)
  const form = ref(false)
  const errorMessage = ref('')
  const showDialog = ref(false)
  const isFullscreen = ref(false)
  const images = ref()

  const endpointGetStations = 'AssemblyDell/GetStations'
  const endpointGetAreas = 'AssemblyDell/GetAreas'
  const endpointGetLines = 'AssemblyDell/GetLines'
  const endpointSearchSop = 'AssemblyDell/GetSopForProduction'

  const getStations = async () =>
    (itemsStation.value = (await apiClient.get(endpointGetStations)).items)

  const getAreas = async () =>
    (itemsArea.value = (await apiClient.get(endpointGetAreas)).items)

  const getLines = async () =>
    (itemsLine.value = (await apiClient.get(endpointGetLines)).items)

  const loadData = async () => {
    loading.value = true
    try {
      await Promise.all([getStations(), getAreas(), getLines()])
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const searchSop = async () => {
    try {
      const { valid } = await form.value.validate()

      if (!valid) return

      loadingSearch.value = true

      const data = {
        IdLine: currentLine.value,
        IdArea: currentArea.value,
        IdStation: currentStation.value
      }

      const response = await apiClient.post(endpointSearchSop, data)

      images.value = useGlobalStore().imageSopAssyDellUrl(
        response.items[0].IdDoc,
        response.items[0].IdStation,
        response.items[0].Images
      )

      isFullscreen.value = true
    } catch (error) {
      errorMessage.value = error
      showDialog.value = true
    } finally {
      loadingSearch.value = false
    }
  }

  onMounted(() => {
    loadData()
    document.addEventListener('fullscreenchange', handleFullscreenChange)
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      isFullscreen.value = false
    }
  }

  watch(isFullscreen, (newValue) => {
    if (newValue) {
      document.querySelector('html', 'body').style.overflow = 'hidden'
      document.documentElement.requestFullscreen()

      return
    }

    if (!newValue) {
      document.querySelector('html', 'body').style.overflow = ''

      if (document.fullscreenElement) document.exitFullscreen()
    }
  })
</script>

<template>
  <v-dialog
    v-model="isFullscreen"
    fullscreen
  >
    <v-card dark>
      <v-btn
        color="red darken-1"
        @click="isFullscreen = false"
        style="
          position: absolute;
          top: 25px;
          right: 25px;
          z-index: 3;
          font-weight: bold;
        "
        text="x"
      />
      <v-carousel
        height="100%"
        width="100%"
        show-arrows="hover"
        :cycle="isFullscreen"
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="(item, i) in images"
          :key="i"
          :src="item"
          eager
        />
      </v-carousel>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
  >
    <v-container>
      <v-card>
        <v-card-title
          class="d-flex align-center mt-3 ml-2 mb-3"
          style="font-weight: bold"
        >
          SOP not found
          <v-spacer />
          <v-btn
            color="red darken-1"
            @click.stop="showDialog = false"
            style="font-weight: bold"
            text="x"
          />
        </v-card-title>
        <v-card-text
          class="ml-2 mb-2"
          style="font-size: medium"
        >
          {{ errorMessage }}
        </v-card-text>
      </v-card>
    </v-container>
  </v-dialog>
  <v-container class="pa-4">
    <v-form
      ref="form"
      @submit.prevent
    >
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="currentLine"
            variant="solo"
            max-width="600"
            :items="itemsLine"
            item-value="id"
            item-title="Name"
            label="Lines"
            :rules="[(value) => !!value || 'Line is required']"
            :disabled="loading"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="currentArea"
            max-width="600"
            variant="solo"
            :items="itemsArea"
            item-title="Area"
            item-value="id"
            label="Areas"
            :rules="[(value) => !!value || 'Area is required']"
            :disabled="loading"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="currentStation"
            max-width="600"
            variant="solo"
            :items="itemsStation"
            item-value="id"
            item-title="Station"
            label="Stations"
            :rules="[(value) => !!value || 'Station is required']"
            :disabled="loading"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            @click="searchSop"
            :disabled="loading"
            :loading="loadingSearch"
            elevation="3"
            text="Search SOP"
            class="mr-2"
            type="submit"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
