import type { IndexImage } from "../types/IndexImage";

export const fetchImages = async (apiUrl: string): Promise<{ data: IndexImage[], pagination: { pages: number } }> => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error('Invalid response format');
    }
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};