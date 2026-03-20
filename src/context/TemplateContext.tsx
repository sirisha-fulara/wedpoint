/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createTemplate, deleteTemplate, fetchTemplates } from '../lib/api';

export interface Template {
  id: number | string;
  name: string;
  description?: string;
  price: string;
  videoPrice?: string;
  images: string[];
  videoUrl?: string;
  pdfUrl?: string;
  type: string;
  badge?: string;
  religion: string;
}

interface TemplateContextType {
  templates: Template[];
  isLoading: boolean;
  error: string;
  addTemplate: (template: {
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
  }) => Promise<void>;
  removeTemplate: (id: number | string, adminPassword: string) => Promise<void>;
}

const initialTemplates: Template[] = [
  {
    id: 'demo-slider-template',
    name: 'Lorinor Demo Multi Event Invite',
    description: 'Demo template added for testing the sliding gallery, embedded video player, and in-page PDF viewer experience.',
    price: '₹499',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
    ],
    videoPrice: '₹799',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'video',
    badge: 'Demo',
    religion: 'muslim'
  },
  {
    id: 1,
    name: 'Royal Floral Hindu Invite',
    description: 'A luxurious floral design perfect for traditional Hindu weddings.',
    price: '₹299',
    images: ['https://images.unsplash.com/photo-1605370903332-9cb7e54f00b9?w=500&q=80', 'https://images.unsplash.com/photo-1544431945-8ced4bfaa6a2?w=500&q=80'],
    videoPrice: '₹499',
    type: 'printed',
    religion: 'hindu'
  },
  {
    id: 2,
    name: 'Elegant Gold Nikah Card',
    description: 'A sophisticated gold and white design for a memorable Nikah ceremony.',
    price: '₹299',
    images: ['https://images.unsplash.com/photo-1544431945-8ced4bfaa6a2?w=500&q=80'],
    videoPrice: '₹499',
    type: 'digital',
    religion: 'muslim'
  },
  {
    id: 3,
    name: 'Traditional Mandap Invite',
    description: 'Classic imagery featuring a beautiful mandap setup.',
    price: '₹399',
    images: ['https://images.unsplash.com/photo-1583089892943-e02e5bb940b3?w=500&q=80', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80'],
    videoPrice: '₹599',
    type: 'printed',
    religion: 'hindu'
  },
  {
    id: 4,
    name: 'Anand Karaj Couple Story',
    description: 'An animated video invitation telling your beautiful couple story.',
    price: '₹599',
    images: ['https://images.unsplash.com/photo-1505932591602-53b7da5bc708?w=500&q=80'],
    videoPrice: '₹799',
    type: 'video',
    badge: 'Best Seller',
    religion: 'sikh'
  },
  {
    id: 5,
    name: 'Classic White Church Wedding',
    description: 'Minimalist and elegant design for a traditional church wedding.',
    price: '₹349',
    images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80'],
    videoPrice: '₹549',
    type: 'digital',
    religion: 'christian'
  },
  {
    id: 6,
    name: 'Modern Mint Walima Invite',
    description: 'Fresh mint colors for a contemporary Walima celebration.',
    price: '₹299',
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80'],
    videoPrice: '₹499',
    type: 'printed',
    religion: 'muslim'
  }
];

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates();
        if (isMounted) {
          setTemplates(data);
          setError('');
        }
      } catch (e) {
        console.error('Failed to load templates from API', e);
        if (isMounted) {
          setError('Using local sample templates until the API is configured.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTemplate = async (newTemplate: {
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
  }) => {
    const template = await createTemplate(newTemplate);
    setTemplates((prev) => [template, ...prev]);
    setError('');
  };

  const removeTemplate = async (id: number | string, adminPassword: string) => {
    await deleteTemplate(id, adminPassword);
    setTemplates((prev) => prev.filter((template) => template.id !== id));
    setError('');
  };

  return (
    <TemplateContext.Provider value={{ templates, isLoading, error, addTemplate, removeTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
};

