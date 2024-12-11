<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center text-tokyo-night-accent">Flickr Public Feed Viewer</h1>
    <div class="flex gap-4 mb-8">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by tags..."
        class="flex-grow px-4 py-2 rounded-md bg-tokyo-night-bg-lighter border border-tokyo-night-border text-tokyo-night-text placeholder-tokyo-night-text-muted focus:outline-none focus:border-tokyo-night-accent"
        @keyup.enter="searchImages"
      />
      <button
        @click="searchImages"
        class="px-4 py-2 bg-tokyo-night-accent text-tokyo-night-bg rounded-md hover:bg-tokyo-night-accent-hover transition-colors duration-200"
      >
        <LucideSearch class="w-5 h-5 inline-block mr-2" />
        Search
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(image, index) in filteredImages"
        :key="image.id"
        class="bg-tokyo-night-bg-lighter rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
      >
        <NuxtLink :to="`/image/${image.id}`">
          <img :src="image.url_m" :alt="image.title" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h2 class="font-semibold mb-2 truncate">{{ image.title }}</h2>
            <p class="text-sm text-tokyo-night-text-muted mb-2">By {{ image.ownername }}</p>
            <p class="text-sm text-tokyo-night-text-muted mb-2">Taken: {{ new Date(image.datetaken).toLocaleDateString() }}</p>
            <p class="text-sm text-tokyo-night-text-muted mb-2">Uploaded: {{ new Date(image.dateupload).toLocaleDateString() }}</p>
            <p class="text-sm text-tokyo-night-text-muted truncate" v-html="image.description._content"></p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const runtimeConfig = useRuntimeConfig()

const searchTerm = ref('')
const images = ref([])

const filteredImages = computed(() => {
  return images.value;
})

const searchImages = async () => {
  try {
    let tagsQueryParam = '';

    if (searchTerm.value !== '') {
      tagsQueryParam = `&tags=${searchTerm.value}`;
    }

    console.log('Tags query param:', tagsQueryParam);

    const apiUrl = `${runtimeConfig.public.flickViewApiUrl}/feed?per_page=9&format=json&nojsoncallback=1` + tagsQueryParam;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('Fetched images:', data.data);
    images.value = data.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Initial load of images
searchImages()
</script>