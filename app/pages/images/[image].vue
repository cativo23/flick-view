<template>
  <div class="container mx-auto px-4 py-8">
    <NuxtLink to="/" class="text-tokyo-night-accent hover:underline">Back to Gallery</NuxtLink>
    <div v-if="loading" class="animate-pulse mt-8">
      <div class="bg-tokyo-night-bg-lighter rounded-lg overflow-hidden shadow-lg">
        <div class="w-full h-96 bg-tokyo-night-bg"></div>
        <div class="p-4">
          <div class="h-4 bg-tokyo-night-border mb-2"></div>
          <div class="h-4 bg-tokyo-night-border mb-2"></div>
          <div class="h-4 bg-tokyo-night-border mb-2"></div>
          <div class="h-4 bg-tokyo-night-border mb-2"></div>
          <div class="h-4 bg-tokyo-night-border"></div>
        </div>
      </div>
    </div>
    <div v-else class="mt-8">
      <div v-if="image" class="bg-tokyo-night-bg-lighter rounded-lg overflow-hidden shadow-lg">
        <img :src="imageSource || fallbackImageUrl" :alt="image.title._content" class="w-full h-96 object-cover" />
        <div class="p-4">
          <NuxtLink :href="image.urls.url[0]?._content" external target="_blank">
            <h1 class="text-2xl font-bold mb-2">{{ image.title._content }}</h1>
          </NuxtLink>
          <p class="text-sm text-tokyo-night-text-muted mb-2"><span class="font-bold">By <span class="italic">{{
            image.owner.realname + "(" + image.owner.username + ")" }}</span> </span> </p>
          <p class="text-sm text-tokyo-night-text-muted mb-2"><span class="font-bold">Taken:</span> {{ new
            Date(image.dates.taken).toLocaleDateString() }}</p>
          <p class="text-sm text-tokyo-night-text-muted mb-2"><span class="font-bold">Uploaded:</span> {{
            formatDate(image.dates.posted) }}</p>
          <p class="text-sm text-tokyo-night-text-muted mb-2"><span class="font-bold">Last Updated:</span> {{
            formatDate(image.dates.lastupdate) }}</p>
          <p class="text-sm text-tokyo-night-text-muted mb-4 text-justify" v-html="image.description._content"></p>
          <!--Tags-->
          <div class="flex flex-wrap gap-2">
            <NuxtLink v-for="tag in image.tags.tag" :key="tag.id" :href="getTagUrl(tag._content)">
              <span class="bg-tokyo-night-accent text-tokyo-night-bg px-2 py-1 rounded-md text-sm">{{ tag._content
                }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="bg-tokyo-night-bg-lighter rounded-lg overflow-hidden shadow-lg mt-4">
        <div class="p-4">
          <h2 class="text-xl font-semibold my-4">Comments</h2>
          <div v-if="commentsSize <= 0" class="text-tokyo-night-text-muted">No comments available.</div>
          <div v-for="comment in comments" :key="comment.id" class="mb-4">
            <p class="text-sm text-tokyo-night-text-muted mb-1"><strong>{{ comment.authorname }}</strong> said:</p>
            <p class="text-sm text-tokyo-night-text" v-html="comment._content"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchImageDetails, fetchComments } from '~~/services/apiService';
import type { Image } from '~~/types/Image';
import type { Comment } from '~~/types/Comment';
import type { ImageSize } from '~~/types/ImageSize';

interface RuntimeConfig {
  public: {
    flickViewApiUrl: string;
  };
}

const route = useRoute();
const imageId = route.params.image as string;
const image = ref<Image | null>(null);
const comments = ref<Comment[]>([]);
const commentsSize = ref<number>(0);
const loading = ref<boolean>(true);
const imageSource = ref<string | undefined>(undefined);
const fallbackImageUrl = '/fallback.png';

const runtimeConfig = useRuntimeConfig() as RuntimeConfig;

const loadImageDetails = async (): Promise<void> => {
  try {
    const apiUrl = runtimeConfig.public.flickViewApiUrl;
    image.value = await fetchImageDetails(imageId, apiUrl);
    imageSource.value = image.value.images.find((size: ImageSize) => size.label === 'Large')?.source;
  } catch (error) {
    console.error('Error fetching image details:', error);
  } finally {
    loading.value = false;
  }
};

const getComments = async (): Promise<void> => {
  try {
    comments.value = await fetchComments(imageId, runtimeConfig.public.flickViewApiUrl);
    commentsSize.value = comments.value.length;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const getTagUrl = (tag: string): string => {
  return `/?tags=${tag}`;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

onMounted(() => {
  loadImageDetails();
  getComments();
});
</script>

<style scoped>
.container {
  max-width: auto;
}
</style>