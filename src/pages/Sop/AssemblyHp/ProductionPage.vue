<script setup>
  import { ref, onMounted, watch, onUnmounted } from 'vue'
  import LineAutocomplete from '@components/Sop/AssemblyHp/LineAutocomplete.vue'
  import StationAutocomplete from '@components/Sop/AssemblyHp/StationAutocomplete.vue'
  import ModelAutocomplete from '@components/Sop/AssemblyHp/ModelAutocomplete.vue'
  import apiClient from '@utils/axiosConfig.js'
  import { useGlobalStore } from '@stores/globalStore.js'

  const loading = ref(false)
  const form = ref(false)
  const errorMessage = ref('')
  const showDialog = ref(false)
  const isFullscreen = ref(false)
  const images = ref()

  const data = ref({})
  const endpointSearchSop = 'Hp/Sop/AssemblyHpSop/Show'

  const searchSop = async () => {
    loading.value = true
    try {
      const { valid } = await form.value.validate()

      if (!valid) return

      const { items } = await apiClient.post(endpointSearchSop, data.value)

      images.value = useGlobalStore().imageSopAssyHpUrl(
        items[0].IdDoc,
        items[0].IdStation,
        items[0].Images
      )

      isFullscreen.value = true
    } catch (error) {
      errorMessage.value = error
      showDialog.value = true
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
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
          <LineAutocomplete
            v-model="data.IdLine"
            max-width="600"
            :rules="[(value) => !!value || 'Line is required']"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ModelAutocomplete
            v-model="data.IdArea"
            max-width="600"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <StationAutocomplete
            v-model="data.IdStation"
            max-width="600"
            :rules="[(value) => !!value || 'Station is required']"
            endpoint="Hp/Sop/AssemblyHpStation/Get"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            @click="searchSop"
            :disabled="loading"
            :loading="loading"
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
