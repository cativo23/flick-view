<template>
  <div class="container mx-auto px-4 py-8">
    <NuxtLink to="/" external>
      <h1 class="text-4xl font-bold mb-8 text-center text-tokyo-night-accent">Flick View</h1>
    </NuxtLink>
    <NuxtTurnstile v-if="!captchaResolved" v-model="token"/>
    <div class="flex gap-4 mb-8">
      <div class="flex-grow">
        <p>Search By Tags:</p>
        <div class="flex flex-wrap gap-2 mb-2">
          <span v-for="(tag, index) in tags" :key="index"
            class="bg-tokyo-night-accent text-tokyo-night-bg px-2 py-1 rounded-full cursor-pointer"
            @click="removeTag(index)">
            {{ tag }}
          </span>
        </div>
        <p v-if="tags.length >0" class="text-sm text-tokyo-night-text-muted mb-2">
          Click or tap on a tag to remove it.
        </p>
        <div class="flex items-center gap-2">
          <input v-model="searchTerm" type="text" placeholder="Search by tags..."
            class="w-full px-4 py-2 rounded-md bg-tokyo-night-bg-lighter border border-tokyo-night-border text-tokyo-night-text placeholder-tokyo-night-text-muted focus:outline-none focus:border-tokyo-night-accent"
            :disabled="!captchaResolved" @keyup.enter="searchImages" @keydown.tab.prevent="addTag" />
          <button @click="addTag"
            class="px-4 py-2 bg-tokyo-night-accent text-tokyo-night-bg rounded-md hover:bg-tokyo-night-accent-hover transition-colors duration-200">
            Add Tag
          </button>
          <button @click="searchImages"
            class="px-4 py-2 bg-tokyo-night-accent text-tokyo-night-bg rounded-md hover:bg-tokyo-night-accent-hover transition-colors duration-200">
            <LucideSearch class="w-5 h-5 inline-block mr-2" />
            Search
          </button>
        </div>

        <p class="text-sm text-tokyo-night-text-muted mt-2">
          <LucideKeyboard class="w-5 h-5 inline-block mr-2" />Press Tab or click "Add Tag" to add a tag, Enter
          <LucideCornerDownLeft class="w-5 h-5 inline-block mr-2" /> to search
        </p>
      </div>

    </div>
    <div v-if="errorMessage" class="text-red-500 text-center mb-4">
      {{ errorMessage }}
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-if="loading" v-for="num in [1, 2, 3, 4]" :key="num" class="animate-pulse">
        <div class="bg-tokyo-night-bg-lighter rounded-lg overflow-hidden shadow-lg">
          <div class="w-full h-48 bg-tokyo-night-bg"></div>
          <div class="p-4">
            <div class="h-4 bg-tokyo-night-border mb-2"></div>
            <div class="h-4 bg-tokyo-night-border mb-2"></div>
            <div class="h-4 bg-tokyo-night-border mb-2"></div>
            <div class="h-4 bg-tokyo-night-border mb-2"></div>
            <div class="h-4 bg-tokyo-night-border"></div>
          </div>
        </div>
      </div>
      <div v-if="!loading && filteredImages.length === 0" class="col-span-4 text-center text-tokyo-night-text-muted">
        No images found.
      </div>
      <div v-if="!loading && filteredImages.length > 0" v-for="image in filteredImages" :key="image.id"
        class="bg-tokyo-night-bg-lighter rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
        <NuxtLink :to="`/images/${image.id}`">
          <img :src="image.url_m || fallbackImageUrl" :alt="image.title" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h2 class="font-semibold mb-2 truncate">{{ image.title }}</h2>
            <p class="text-sm text-tokyo-night-text-muted mb-2">By {{ image.ownername }}</p>
            <p class="text-sm text-tokyo-night-text-muted mb-2">Taken: {{ new Date(image.datetaken).toLocaleDateString()
              }}</p>
            <p class="text-sm text-tokyo-night-text-muted mb-2">Uploaded: {{ formatDate(image.dateupload) }}</p>
            <p class="text-sm text-tokyo-night-text-muted truncate" v-html="image.description._content"></p>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex justify-center mt-8">
      <button @click="prevPage" :disabled="currentPage === 1" v-if="filteredImages.length !== 0"
        class="px-2 py-2 mx-1 bg-tokyo-night-accent text-tokyo-night-bg rounded-md hover:bg-tokyo-night-accent-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        <LucideArrowLeft class="w-5 h-5 inline-block mr-2" />
      </button>
      <button v-for="page in pages" :key="page" @click="goToPage(page)"
        :class="['px-2 py-2 mx-1 rounded-md transition-colors duration-200', { 'bg-tokyo-night-accent text-tokyo-night-bg': page === currentPage, 'bg-tokyo-night-bg-lighter text-tokyo-night-text': page !== currentPage }]">
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages" v-if="filteredImages.length !== 0"
        class="px-2 py-2 mx-1 bg-tokyo-night-accent text-tokyo-night-bg rounded-md hover:bg-tokyo-night-accent-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        <LucideArrowRight class="w-5 h-5 inline-block mr-2" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

const searchTerm = ref('');
const tags = ref([]);
const images = ref([]);
const loading = ref(false);
const currentPage = ref(parseInt(route.query.page) || 1);
const totalPages = ref(1);
const token = ref();
const captchaResolved = ref(false);
const fallbackImageUrl = 'fallback.png';
const errorMessage = ref('');

const filteredImages = computed(() => {
  return images.value;
});

const updateQueryParams = () => {
  router.push({
    query: {
      tags: tags.value.join(','),
      page: currentPage.value,
    },
  });
};

const searchImages = async () => {
  try {
    loading.value = true;
    errorMessage.value = ''; // Clear any previous error message
    let tagsQueryParam = '';

    if (tags.value.length > 0) {
      tagsQueryParam = `&tags=${tags.value.join(',')}`;
    }

    const apiUrl = `${runtimeConfig.public.flickViewApiUrl}/feed?per_page=12&page=${currentPage.value}` + tagsQueryParam;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    const data = await response.json();
    images.value = data.data;
    totalPages.value = data.pagination.pages;
    updateQueryParams();
  } catch (error) {
    errorMessage.value = 'Error fetching images. Please try again later.';
    console.error('Error fetching images:', error);
  } finally {
    loading.value = false;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    searchImages();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    searchImages();
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    searchImages();
  }
};

const pages = computed(() => {
  const range = [];
  const maxPagesToShow = 2;
  const startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  if (startPage > 1) {
    range.push(1);
    if (startPage > 2) {
      range.push('...');
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }

  if (endPage < totalPages.value) {
    if (endPage < totalPages.value - 1) {
      range.push('...');
    }
    range.push(totalPages.value);
  }

  return range;
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const onCaptchaSuccess = () => {
  captchaResolved.value = true;
};

const addTag = (event) => {
  if (searchTerm.value.trim() !== '') {
    tags.value.push(searchTerm.value.trim());
    searchTerm.value = '';
    if (event) event.preventDefault();
  }
};

const removeTag = (index) => {
  tags.value.splice(index, 1);
};

onMounted(() => {
  // Initialize tags and currentPage from query parameters
  if (route.query.tags) {
    tags.value = route.query.tags.split(',');
  }
  if (route.query.page) {
    currentPage.value = parseInt(route.query.page);
  }
  searchImages();
});

watch([currentPage], () => {
  searchImages();
});

watch(token, (newToken) => {
  if (newToken) {
    captchaResolved.value = true;
  }
});
</script>