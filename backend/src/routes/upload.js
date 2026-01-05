const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToS3 } = require('../services/s3Service');

const { PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const db = require("../db/dynamo");
const { v4: uuidv4 } = require('uuid');
const { invokeImageLambda } = require("../services/lambdaService");


/**
 * Multer config
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * POST /api/upload
 * Upload image → S3 → store metadata + thumbnail in DynamoDB
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // ✅ Validate
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1️⃣ Upload original image to S3
    const s3Result = await uploadToS3(req.file);

    // 2️⃣ Create thumbnail (base64 – REQUIRED for LocalStack UI)
    const thumbnailBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // 3️⃣ Save metadata in DynamoDB
    const imageId = uuidv4();

    await db.send(new PutItemCommand({
      TableName: "Images",
      Item: {
        imageId: { S: imageId },
        imageUrl: { S: s3Result.Location },
        thumbnail: { S: thumbnailBase64 },
        uploadedAt: { S: new Date().toISOString() },
        lambdaProcessed: { BOOL: false } // 👈 Lambda hook
      }
    }));

    await invokeImageLambda(imageId);

    // 4️⃣ Lambda trigger placeholder
    console.log(`🚀 Lambda will process imageId: ${imageId}`);

    res.status(200).json({
      message: "Image uploaded successfully",
      imageId,
      imageUrl: s3Result.Location
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/**
 * GET /api/images
 * Fetch images FROM DynamoDB
 */
router.get('/images', async (req, res) => {
  try {
    const data = await db.send(new ScanCommand({
      TableName: "Images"
    }));

    const images = (data.Items || []).map(item => ({
      imageId: item.imageId.S,
      imageUrl: item.imageUrl.S,
      thumbnail: item.thumbnail.S, // ✅ THIS FIXES UI
      uploadedAt: item.uploadedAt.S,
      lambdaProcessed: item.lambdaProcessed?.BOOL || false
    }));

    res.status(200).json({ images });

  } catch (err) {
    console.error("Fetch images error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

module.exports = router;
