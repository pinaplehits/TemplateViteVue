import apiClient from './axiosConfig.js'
import { convertDateProperties } from './dateUtils.js'

/**
 * Fetch data from the given endpoint and populate the admin table with items and headers.
 *
 * @param {string} endpointGet - The endpoint URL to fetch data from.
 * @returns {Promise<{items: Array, headers: Array}>} An object containing the items and headers for the admin table.
 */
export async function populateAdminTable(endpointGet) {
  const response = await apiClient.get(endpointGet)
  let items = []
  let headers = []

  if (response.items) {
    items = convertDateProperties(response)
  }

  if (response.headers) {
    headers = response.headers.filter((header) => header.visible === true)
    headers.push({ title: 'Actions', key: 'Actions' })
  }

  return { items, headers }
}
