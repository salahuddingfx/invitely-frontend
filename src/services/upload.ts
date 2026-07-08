import { api } from './api';

/**
 * Upload a file to Cloudinary via the server's /api/upload endpoint.
 * Returns the Cloudinary URL string on success, or throws on error.
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  if (res.data?.success && res.data?.data?.url) {
    return res.data.data.url as string;
  }

  throw new Error(res.data?.message || 'Upload failed');
};
