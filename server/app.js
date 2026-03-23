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

const normalizeToArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
};

const buildSignedDeliveryUrl = (publicId, resourceType, fallbackUrl = null) => {
  if (!publicId) {
    return fallbackUrl;
  }

  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: 'upload',
    secure: true,
    sign_url: true,
  });
};

const buildPrivateRawDownloadUrl = (publicId, fallbackUrl = null) => {
  if (!publicId) {
    return fallbackUrl;
  }

  return cloudinary.utils.private_download_url(publicId, '', {
    resource_type: 'raw',
    type: 'upload',
    expires_at: Math.floor(Date.now() / 1000) + 60 * 10,
  });
};

const serializeTemplate = (row) => ({
  ...row,
  videoUrl: buildSignedDeliveryUrl(row.videoPublicId, 'video', row.videoUrl),
  pdfUrl: row.pdfPublicId || row.pdfUrl ? `/api/templates/${row.id}/pdf-preview` : null,
});

const streamCloudinaryAsset = async (res, publicId, resourceType, fallbackUrl, downloadFileName) => {
  const sourceUrl = resourceType === 'raw' ? buildPrivateRawDownloadUrl(publicId, fallbackUrl) : buildSignedDeliveryUrl(publicId, resourceType, fallbackUrl);

  if (!sourceUrl) {
    res.status(404).json({ message: 'File not found' });
    return;
  }

  const upstream = await fetch(sourceUrl);

  if (!upstream.ok) {
    res.status(upstream.status).json({ message: 'Failed to load file preview' });
    return;
  }

  const contentType = upstream.headers.get('content-type') || (resourceType === 'raw' ? 'application/pdf' : 'application/octet-stream');
  const contentLength = upstream.headers.get('content-length');

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${downloadFileName || 'preview'}"`);
  res.setHeader('Cache-Control', 'private, max-age=300');

  if (contentLength) {
    res.setHeader('Content-Length', contentLength);
  }

  const arrayBuffer = await upstream.arrayBuffer();
  res.send(Buffer.from(arrayBuffer));
};

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

app.post('/api/admin/cloudinary-signature', (req, res) => {
  if (!isAuthorized(req)) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const folder = typeof req.body?.folder === 'string' && req.body.folder.trim()
    ? req.body.folder.trim()
    : 'wedding-card/uploads';
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    timestamp,
    signature,
  });
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

    res.json(result.rows.map(serializeTemplate));
  } catch (error) {
    console.error('Failed to fetch templates', error);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

app.get('/api/templates/:id/pdf-preview', async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          pdf_url AS "pdfUrl",
          pdf_public_id AS "pdfPublicId",
          pdf_file_name AS "pdfFileName"
        FROM templates
        WHERE id = $1
      `,
      [req.params.id]
    );

    const template = result.rows[0];

    if (!template || (!template.pdfPublicId && !template.pdfUrl)) {
      res.status(404).json({ message: 'PDF not found' });
      return;
    }

    await streamCloudinaryAsset(
      res,
      template.pdfPublicId,
      'raw',
      template.pdfUrl,
      template.pdfFileName || `${template.name || 'template'}-preview.pdf`
    );
  } catch (error) {
    console.error('Failed to preview PDF', error);
    res.status(500).json({ message: 'Failed to preview PDF' });
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
      const imageUrlsFromBody = normalizeToArray(req.body.images);
      const imagePublicIdsFromBody = normalizeToArray(req.body.imagePublicIds);
      const imageFileNamesFromBody = normalizeToArray(req.body.imageFileNames);
      const videoUrlFromBody = typeof req.body.videoUrl === 'string' ? req.body.videoUrl.trim() : '';
      const videoPublicIdFromBody = typeof req.body.videoPublicId === 'string' ? req.body.videoPublicId.trim() : '';
      const videoFileNameFromBody = typeof req.body.videoFileName === 'string' ? req.body.videoFileName.trim() : '';
      const pdfUrlFromBody = typeof req.body.pdfUrl === 'string' ? req.body.pdfUrl.trim() : '';
      const pdfPublicIdFromBody = typeof req.body.pdfPublicId === 'string' ? req.body.pdfPublicId.trim() : '';
      const pdfFileNameFromBody = typeof req.body.pdfFileName === 'string' ? req.body.pdfFileName.trim() : '';

      if (imageFiles.length === 0 && imageUrlsFromBody.length === 0) {
        res.status(400).json({ message: 'At least one image is required' });
        return;
      }

      const uploadedImages = imageFiles.length > 0
        ? await Promise.all(
            imageFiles.map((file) => uploadToCloudinary(file, 'image', 'wedding-card/images'))
          )
        : imageUrlsFromBody.map((url, index) => ({
            secure_url: url,
            public_id: imagePublicIdsFromBody[index] || null,
          }));

      const uploadedVideo = videoFile
        ? await uploadToCloudinary(videoFile, 'video', 'wedding-card/videos')
        : videoUrlFromBody
          ? {
              secure_url: videoUrlFromBody,
              public_id: videoPublicIdFromBody || null,
            }
          : null;

      const uploadedPdf = pdfFile
        ? await uploadToCloudinary(pdfFile, 'raw', 'wedding-card/pdfs')
        : pdfUrlFromBody
          ? {
              secure_url: pdfUrlFromBody,
              public_id: pdfPublicIdFromBody || null,
            }
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
          imageFiles.length > 0 ? imageFiles.map((file) => file.originalname) : imageFileNamesFromBody,
          videoFile?.originalname || videoFileNameFromBody || null,
          pdfFile?.originalname || pdfFileNameFromBody || null,
          type.trim(),
          badge?.trim() || null,
          religion.trim(),
        ]
      );

      res.status(201).json(serializeTemplate(result.rows[0]));
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




