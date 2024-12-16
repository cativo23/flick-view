<template>
  <div class="container mx-auto px-4 py-8">
    <NuxtLink to="/">
      <h1 class="text-4xl font-bold mb-8 text-center text-tokyo-night-accent">Flick View</h1>
    </NuxtLink>
    <div class="flex gap-4 mb-8">
      <NuxtTurnstile v-if="!captchaResolved" v-model="token" @success="onCaptchaSuccess" />
      <div class="flex-grow">
        <div class="flex flex-wrap gap-2 mb-2">
          <span v-for="(tag, index) in tags" :key="index"
            class="bg-tokyo-night-accent text-tokyo-night-bg px-2 py-1 rounded-full cursor-pointer"
            @click="removeTag(index)">
            {{ tag }}
          </span>
        </div>
        <input v-model="searchTerm" type="text" placeholder="Search by tags..."
          class="w-full px-4 py-2 rounded-md bg-tokyo-night-bg-lighter border border-tokyo-night-border text-tokyo-night-text placeholder-tokyo-night-text-muted focus:outline-none focus:border-tokyo-night-accent"
          :disabled="!captchaResolved" @keyup.enter="searchImages" @keydown.tab.prevent="addTag" />
        <p class="text-sm text-tokyo-night-text-muted mt-2">
          <LucideKeyboard class="w-5 h-5 inline-block mr-2" />Press Tab
          <LucideArrowRightToLine class="w-5 h-5 inline-block mr-2" /> to add a tag, Enter
          <LucideCornerDownLeft class="w-5 h-5 inline-block mr-2" /> to search
        </p>
      </div>
      <button @click="searchImages"
        class="px-4 py-2 bg-tokyo-night-accent text-tokyo-night-bg rounded-md hover:bg-tokyo-night-accent-hover transition-colors duration-200">
        <LucideSearch class="w-5 h-5 inline-block mr-2" />
        Search
      </button>
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
      <div v-if="!loading" v-for="image in filteredImages" :key="image.id"
        class="bg-tokyo-night-bg-lighter rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
        <NuxtLink :to="`/images/${image.id}`">
          <img :src="image.url_m" :alt="image.title" class="w-full h-48 object-cover" />
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
      <button @click="prevPage" :disabled="currentPage === 1"
        class="px-4 py-2 mx-2 bg-tokyo-night-accent text-tokyo-night-bg rounded-md hover:bg-tokyo-night-accent-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        Previous
      </button>
      <button v-for="page in pages" :key="page" @click="goToPage(page)"
        :class="['px-4 py-2 mx-1 rounded-md transition-colors duration-200', { 'bg-tokyo-night-accent text-tokyo-night-bg': page === currentPage, 'bg-tokyo-night-bg-lighter text-tokyo-night-text': page !== currentPage }]">
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="px-4 py-2 mx-2 bg-tokyo-night-accent text-tokyo-night-bg rounded-md hover:bg-tokyo-night-accent-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        Next
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
const token = ref('');
const captchaResolved = ref(false);

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
    let tagsQueryParam = '';

    if (tags.value.length > 0) {
      tagsQueryParam = `&tags=${tags.value.join(',')}`;
    }

    const apiUrl = `${runtimeConfig.public.flickViewApiUrl}/feed?per_page=12&page=${currentPage.value}` + tagsQueryParam;
    const response = await fetch(apiUrl);
    const data = await response.json();
    images.value = data.data;
    totalPages.value = data.pagination.pages;
    updateQueryParams();
  } catch (error) {
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
  const maxPagesToShow = 4;
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

const addTag = () => {
  if (searchTerm.value.trim() !== '') {
    tags.value.push(searchTerm.value.trim());
    searchTerm.value = '';
  }
};

const removeTag = (index) => {
  tags.value.splice(index, 1);
};

onMounted(() => {
  if (process.env.NODE_ENV === 'development') {
    captchaResolved.value = true;
  }
  searchImages();
});

watch([currentPage], () => {
  searchImages();
});
</script>