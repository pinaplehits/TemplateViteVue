import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavStore = defineStore('nav', () => {
  const storageName = 'navRail'
  const rail = ref(JSON.parse(localStorage.getItem(storageName)) || false)

  const setRail = (value) => {
    rail.value = value
    localStorage.setItem(storageName, JSON.stringify(value))
  }

  return {
    rail,
    setRail
  }
})
