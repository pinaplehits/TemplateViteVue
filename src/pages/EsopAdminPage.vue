<template>
  <v-container fill-height>
    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        Current ESOP
        <v-spacer />
        <v-text-field
          v-model="search"
          density="compact"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          variant="solo-filled"
          flat
        />
      </v-card-title>
      <v-divider />
      <v-data-table
        :items="items"
        :loading="loading"
        :search="search"
        hover
        show-select
        item-value="name"
        v-model="selected"
      >
        <template #loading>
          <v-skeleton-loader type="table-row-divider@10" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  const search = ref()
  const selected = ref([])
  const items = [
    {
      name: 'African Elephant',
      species: 'Loxodonta africana',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests'
    },
    {
      name: 'Bengal Tiger',
      species: 'Panthera tigris tigris',
      diet: 'Carnivore',
      habitat: 'Tropical Rainforests'
    },
    {
      name: 'Blue Whale',
      species: 'Balaenoptera musculus',
      diet: 'Carnivore',
      habitat: 'Oceans'
    },
    {
      name: 'Giant Panda',
      species: 'Ailuropoda melanoleuca',
      diet: 'Herbivore',
      habitat: 'Bamboo Forests'
    },
    {
      name: 'King Penguin',
      species: 'Aptenodytes patagonicus',
      diet: 'Carnivore',
      habitat: 'Subantarctic Islands'
    },
    {
      name: 'Bald Eagle',
      species: 'Haliaeetus leucocephalus',
      diet: 'Carnivore',
      habitat: 'Near Water, Mountains'
    },
    {
      name: 'Koala',
      species: 'Phascolarctos cinereus',
      diet: 'Herbivore',
      habitat: 'Eucalyptus Forests'
    },
    {
      name: 'Red Kangaroo',
      species: 'Macropus rufus',
      diet: 'Herbivore',
      habitat: 'Grasslands, Deserts'
    },
    {
      name: 'Grizzly Bear',
      species: 'Ursus arctos horribilis',
      diet: 'Omnivore',
      habitat: 'Forests, Mountains'
    },
    {
      name: 'African Lion',
      species: 'Panthera leo',
      diet: 'Carnivore',
      habitat: 'Savanna, Grasslands'
    },
    {
      name: 'Great White Shark',
      species: 'Carcharodon carcharias',
      diet: 'Carnivore',
      habitat: 'Coastal Waters'
    },
    {
      name: 'Emperor Penguin',
      species: 'Aptenodytes forsteri',
      diet: 'Carnivore',
      habitat: 'Antarctic Ice'
    },
    {
      name: 'Gray Wolf',
      species: 'Canis lupus',
      diet: 'Carnivore',
      habitat: 'Forests, Grasslands'
    },
    {
      name: 'Giraffe',
      species: 'Giraffa camelopardalis',
      diet: 'Herbivore',
      habitat: 'Savanna, Woodlands'
    },
    {
      name: 'Snow Leopard',
      species: 'Panthera uncia',
      diet: 'Carnivore',
      habitat: 'Mountains'
    },
    {
      name: 'Green Sea Turtle',
      species: 'Chelonia mydas',
      diet: 'Herbivore',
      habitat: 'Oceans'
    },
    {
      name: 'Komodo Dragon',
      species: 'Varanus komodoensis',
      diet: 'Carnivore',
      habitat: 'Tropical Forests'
    },
    {
      name: 'Orangutan',
      species: 'Pongo pygmaeus',
      diet: 'Omnivore',
      habitat: 'Tropical Rainforests'
    },
    {
      name: 'Hippopotamus',
      species: 'Hippopotamus amphibius',
      diet: 'Herbivore',
      habitat: 'Rivers, Lakes'
    },
    {
      name: 'Cheetah',
      species: 'Acinonyx jubatus',
      diet: 'Carnivore',
      habitat: 'Savanna, Grasslands'
    },
    {
      name: 'Polar Bear',
      species: 'Ursus maritimus',
      diet: 'Carnivore',
      habitat: 'Arctic Ice'
    },
    {
      name: 'Siberian Tiger',
      species: 'Panthera tigris altaica',
      diet: 'Carnivore',
      habitat: 'Taiga, Forests'
    },
    {
      name: 'Galápagos Tortoise',
      species: 'Chelonoidis nigra',
      diet: 'Herbivore',
      habitat: 'Galápagos Islands'
    },
    {
      name: 'Jaguar',
      species: 'Panthera onca',
      diet: 'Carnivore',
      habitat: 'Rainforests, Swamps'
    },
    {
      name: 'Gorilla',
      species: 'Gorilla gorilla',
      diet: 'Herbivore',
      habitat: 'Tropical Forests'
    },
    {
      name: 'Atlantic Puffin',
      species: 'Fratercula arctica',
      diet: 'Carnivore',
      habitat: 'Coastal Cliffs'
    },
    {
      name: 'Meerkat',
      species: 'Suricata suricatta',
      diet: 'Omnivore',
      habitat: 'Deserts, Grasslands'
    },
    {
      name: 'Peregrine Falcon',
      species: 'Falco peregrinus',
      diet: 'Carnivore',
      habitat: 'Mountains, Cities'
    },
    {
      name: 'Dugong',
      species: 'Dugong dugon',
      diet: 'Herbivore',
      habitat: 'Coastal Waters'
    },
    {
      name: 'Red Fox',
      species: 'Vulpes vulpes',
      diet: 'Omnivore',
      habitat: 'Forests, Grasslands'
    },
    {
      name: 'Alpaca',
      species: 'Vicugna pacos',
      diet: 'Herbivore',
      habitat: 'Andes Mountains'
    },
    {
      name: 'Narwhal',
      species: 'Monodon monoceros',
      diet: 'Carnivore',
      habitat: 'Arctic Waters'
    },
    {
      name: 'Tasmanian Devil',
      species: 'Sarcophilus harrisii',
      diet: 'Carnivore',
      habitat: 'Forests, Coastal Heaths'
    },
    {
      name: 'Wolverine',
      species: 'Gulo gulo',
      diet: 'Carnivore',
      habitat: 'Forests, Tundra'
    },
    {
      name: 'Rhinoceros',
      species: 'Rhinocerotidae',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests'
    },
    {
      name: 'Anaconda',
      species: 'Eunectes',
      diet: 'Carnivore',
      habitat: 'Rivers, Swamps'
    },
    {
      name: 'Bald Uakari',
      species: 'Cacajao calvus',
      diet: 'Omnivore',
      habitat: 'Flooded Forests'
    },
    {
      name: 'Aye-Aye',
      species: 'Daubentonia madagascariensis',
      diet: 'Omnivore',
      habitat: 'Rainforests'
    },
    {
      name: 'Saiga Antelope',
      species: 'Saiga tatarica',
      diet: 'Herbivore',
      habitat: 'Steppes, Semi-Deserts'
    },
    {
      name: 'Ocelot',
      species: 'Leopardus pardalis',
      diet: 'Carnivore',
      habitat: 'Rainforests, Grasslands'
    },
    {
      name: 'Emu',
      species: 'Dromaius novaehollandiae',
      diet: 'Omnivore',
      habitat: 'Savanna, Forests'
    }
  ]

  const loading = ref(true)

  setTimeout(() => {
    loading.value = false
  }, 1000)
</script>
