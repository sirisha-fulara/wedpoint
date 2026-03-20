import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
let initPromise;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

export const ensureEnv = () => {
  const required = [
    'DATABASE_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const isAuthorized = (req) => req.headers['x-admin-password'] === adminPassword;

export const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS templates (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price TEXT NOT NULL,
      video_price TEXT,
      images TEXT[] NOT NULL DEFAULT '{}',
      image_public_ids TEXT[] NOT NULL DEFAULT '{}',
      video_url TEXT,
      video_public_id TEXT,
      pdf_url TEXT,
      pdf_public_id TEXT,
      image_file_names TEXT[] NOT NULL DEFAULT '{}',
      video_file_name TEXT,
      pdf_file_name TEXT,
      type TEXT NOT NULL,
      badge TEXT,
      religion TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE templates
    ADD COLUMN IF NOT EXISTS image_public_ids TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS video_public_id TEXT,
    ADD COLUMN IF NOT EXISTS pdf_public_id TEXT,
    ADD COLUMN IF NOT EXISTS image_file_names TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS video_file_name TEXT,
    ADD COLUMN IF NOT EXISTS pdf_file_name TEXT
  `);
};

export const initializeApp = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      ensureEnv();
      await initializeDatabase();
    })();
  }

  return initPromise;
};

const uploadToCloudinary = (file, resourceType, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        filename_override: file.originalname,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(file.buffer);
  });

const destroyAsset = async (publicId, resourceType) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}`, error);
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body ?? {};

  if (password !== adminPassword) {
    res.status(401).json({ message: 'Invalid admin password' });
    return;
  }

  res.json({ ok: true });
});

app.get('/api/templates', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description,
        price,
        video_price AS "videoPrice",
        images,
        image_public_ids AS "imagePublicIds",
        video_url AS "videoUrl",
        video_public_id AS "videoPublicId",
        pdf_url AS "pdfUrl",
        pdf_public_id AS "pdfPublicId",
        image_file_names AS "imageFileNames",
        video_file_name AS "videoFileName",
        pdf_file_name AS "pdfFileName",
        type,
        badge,
        religion
      FROM templates
      ORDER BY created_at DESC, id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch templates', error);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

app.post(
  '/api/templates',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!isAuthorized(req)) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { name, description, price, videoPrice, religion, type, badge } = req.body;

      if (!name || !price || !religion || !type) {
        res.status(400).json({ message: 'Missing required template fields' });
        return;
      }

      const files = req.files;
      const imageFiles = Array.isArray(files?.images) ? files.images : [];
      const videoFile = Array.isArray(files?.video) ? files.video[0] : undefined;
      const pdfFile = Array.isArray(files?.pdf) ? files.pdf[0] : undefined;

      if (imageFiles.length === 0) {
        res.status(400).json({ message: 'At least one image is required' });
        return;
      }

      const uploadedImages = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file, 'image', 'wedding-card/images'))
      );

      const uploadedVideo = videoFile
        ? await uploadToCloudinary(videoFile, 'video', 'wedding-card/videos')
        : null;
      const uploadedPdf = pdfFile
        ? await uploadToCloudinary(pdfFile, 'raw', 'wedding-card/pdfs')
        : null;

      const result = await pool.query(
        `
          INSERT INTO templates (
            name,
            description,
            price,
            video_price,
            images,
            image_public_ids,
            video_url,
            video_public_id,
            pdf_url,
            pdf_public_id,
            image_file_names,
            video_file_name,
            pdf_file_name,
            type,
            badge,
            religion
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING
            id,
            name,
            description,
            price,
            video_price AS "videoPrice",
            images,
            image_public_ids AS "imagePublicIds",
            video_url AS "videoUrl",
            video_public_id AS "videoPublicId",
            pdf_url AS "pdfUrl",
            pdf_public_id AS "pdfPublicId",
            image_file_names AS "imageFileNames",
            video_file_name AS "videoFileName",
            pdf_file_name AS "pdfFileName",
            type,
            badge,
            religion
        `,
        [
          name.trim(),
          description?.trim() || null,
          price.trim(),
          videoPrice?.trim() || null,
          uploadedImages.map((image) => image.secure_url),
          uploadedImages.map((image) => image.public_id),
          uploadedVideo?.secure_url || null,
          uploadedVideo?.public_id || null,
          uploadedPdf?.secure_url || null,
          uploadedPdf?.public_id || null,
          imageFiles.map((file) => file.originalname),
          videoFile?.originalname || null,
          pdfFile?.originalname || null,
          type.trim(),
          badge?.trim() || null,
          religion.trim(),
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Failed to create template', error);
      res.status(500).json({ message: 'Failed to create template' });
    }
  }
);

app.delete('/api/templates/:id', async (req, res) => {
  try {
    if (!isAuthorized(req)) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await pool.query(
      `
        DELETE FROM templates
        WHERE id = $1
        RETURNING
          id,
          name,
          image_public_ids AS "imagePublicIds",
          video_public_id AS "videoPublicId",
          pdf_public_id AS "pdfPublicId"
      `,
      [req.params.id]
    );

    const deletedTemplate = result.rows[0];

    if (!deletedTemplate) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }

    await Promise.allSettled([
      ...(deletedTemplate.imagePublicIds || []).map((publicId) => destroyAsset(publicId, 'image')),
      destroyAsset(deletedTemplate.videoPublicId, 'video'),
      destroyAsset(deletedTemplate.pdfPublicId, 'raw'),
    ]);

    res.json({ ok: true, id: deletedTemplate.id, name: deletedTemplate.name });
  } catch (error) {
    console.error('Failed to delete template', error);
    res.status(500).json({ message: 'Failed to delete template' });
  }
});

export default app;
