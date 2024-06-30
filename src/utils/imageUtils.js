/**
 * Convert a comma-separated string of image filenames into an array of objects,
 * each containing a `src` property with the full URL to the image.
 *
 * @param {string} images - A comma-separated string of image filenames.
 * @param {string} url - The base URL to be prefixed to each image filename.
 * @returns {Array<{src: string}>} An array of objects, each with a `src` property.
 *
 * The function performs the following steps:
 * 1. Splits the input string into an array of filenames using a comma as the delimiter.
 * 2. Sorts the array of filenames numerically.
 * 3. Maps each filename to an object containing a `src` property with the full URL.
 */
export function mapImagesToUrl(images, url) {
  return images
    .split(',')
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((imagen) => `${url}${imagen}`)
}
