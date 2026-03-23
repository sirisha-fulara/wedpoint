import type { Template } from '../context/TemplateContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

type UploadKind = 'image' | 'video' | 'raw';
type UploadProgressKind = 'images' | 'video' | 'pdf';

interface CloudinarySignatureResponse {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
}

interface UploadedAsset {
  secure_url: string;
  public_id: string;
}

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
  onUploadProgress?: (progress: { kind: UploadProgressKind; percent: number }) => void;
}

const extractErrorMessage = async (response: Response, fallback: string) => {
  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  return data?.message || fallback;
};

const getCloudinarySignature = async (
  adminPassword: string,
  folder: string
): Promise<CloudinarySignatureResponse> => {
  const response = await fetch(buildUrl('/api/admin/cloudinary-signature'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': adminPassword,
    },
    body: JSON.stringify({ folder }),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, 'Failed to prepare media upload'));
  }

  return response.json();
};

const uploadFileDirect = async (
  file: File,
  kind: UploadKind,
  folder: string,
  adminPassword: string,
  onProgress?: (percent: number) => void
): Promise<UploadedAsset> => {
  const signed = await getCloudinarySignature(adminPassword, folder);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signed.apiKey);
  formData.append('timestamp', String(signed.timestamp));
  formData.append('signature', signed.signature);
  formData.append('folder', signed.folder);

  const response = await new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${signed.cloudName}/${kind}/upload`);
    xhr.responseType = 'json';

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      resolve(
        new Response(JSON.stringify(xhr.response), {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    };

    xhr.onerror = () => reject(new Error('Network error while uploading media file'));
    xhr.send(formData);
  });

  if (!response.ok) {
    throw new Error('Failed to upload media file');
  }

  return response.json();
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
  const uploadedImages = await Promise.all(
    payload.images.map((image, index) =>
      uploadFileDirect(image, 'image', 'wedding-card/images', payload.adminPassword, (percent) => {
        const overallPercent = Math.round(((index + percent / 100) / payload.images.length) * 100);
        payload.onUploadProgress?.({ kind: 'images', percent: overallPercent });
      })
    )
  );
  payload.onUploadProgress?.({ kind: 'images', percent: 100 });

  const uploadedVideo = payload.video
    ? await uploadFileDirect(payload.video, 'video', 'wedding-card/videos', payload.adminPassword, (percent) => {
        payload.onUploadProgress?.({ kind: 'video', percent });
      })
    : null;
  if (payload.video) {
    payload.onUploadProgress?.({ kind: 'video', percent: 100 });
  }

  const uploadedPdf = payload.pdf
    ? await uploadFileDirect(payload.pdf, 'raw', 'wedding-card/pdfs', payload.adminPassword, (percent) => {
        payload.onUploadProgress?.({ kind: 'pdf', percent });
      })
    : null;
  if (payload.pdf) {
    payload.onUploadProgress?.({ kind: 'pdf', percent: 100 });
  }

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

  uploadedImages.forEach((image, index) => {
    formData.append('images', image.secure_url);
    formData.append('imagePublicIds', image.public_id);
    formData.append('imageFileNames', payload.images[index].name);
  });

  if (uploadedVideo) {
    formData.append('videoUrl', uploadedVideo.secure_url);
    formData.append('videoPublicId', uploadedVideo.public_id);
    if (payload.video) {
      formData.append('videoFileName', payload.video.name);
    }
  }

  if (uploadedPdf) {
    formData.append('pdfUrl', uploadedPdf.secure_url);
    formData.append('pdfPublicId', uploadedPdf.public_id);
    if (payload.pdf) {
      formData.append('pdfFileName', payload.pdf.name);
    }
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

