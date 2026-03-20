import type { Template } from '../context/TemplateContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

const buildUrl = (path: string) => `${API_BASE_URL}${path}`;

export interface CreateTemplatePayload {
  name: string;
  description: string;
  price: string;
  videoPrice?: string;
  religion: string;
  type: string;
  badge?: string;
  images: File[];
  video?: File | null;
  pdf?: File | null;
  adminPassword: string;
}

const extractErrorMessage = async (response: Response, fallback: string) => {
  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  return data?.message || fallback;
};

export const verifyAdminLogin = async (password: string): Promise<void> => {
  const response = await fetch(buildUrl('/api/admin/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Admin login failed'));
  }
};

export const fetchTemplates = async (): Promise<Template[]> => {
  const response = await fetch(buildUrl('/api/templates'));

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Failed to fetch templates'));
  }

  return response.json();
};

export const createTemplate = async (payload: CreateTemplatePayload): Promise<Template> => {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('description', payload.description);
  formData.append('price', payload.price);
  formData.append('religion', payload.religion);
  formData.append('type', payload.type);

  if (payload.videoPrice) {
    formData.append('videoPrice', payload.videoPrice);
  }

  if (payload.badge) {
    formData.append('badge', payload.badge);
  }

  payload.images.forEach((image) => {
    formData.append('images', image);
  });

  if (payload.video) {
    formData.append('video', payload.video);
  }

  if (payload.pdf) {
    formData.append('pdf', payload.pdf);
  }

  const response = await fetch(buildUrl('/api/templates'), {
    method: 'POST',
    headers: {
      'x-admin-password': payload.adminPassword,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Failed to create template'));
  }

  return response.json();
};

export const deleteTemplate = async (id: number | string, adminPassword: string): Promise<void> => {
  const response = await fetch(buildUrl(`/api/templates/${id}`), {
    method: 'DELETE',
    headers: {
      'x-admin-password': adminPassword,
    },
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Failed to delete template'));
  }
};
