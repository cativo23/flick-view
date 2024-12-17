import type { IndexImage } from "../types/IndexImage";
import type { Image } from '../types/Image';
import type { Comment } from '../types/Comment';

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

export const fetchImageDetails = async (imageId: string, apiUrl: string): Promise<Image> => {
  try {
    const response = await fetch(`${apiUrl}/photo/${imageId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image details: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error('Invalid response format');
    }
    return data.data as Image;
  } catch (error) {
    console.error('Error fetching image details:', error);
    throw error;
  }
};

export const fetchComments = async (imageId: string, apiUrl: string): Promise<Comment[]> => {
  try {
    const response = await fetch(`${apiUrl}/photo/${imageId}/comments`);
    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.comments) {
      throw new Error('Invalid response format');
    }
    return data.comments as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};