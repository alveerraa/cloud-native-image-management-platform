/**
 * Mock S3 Service (Local Development)
 * NO AWS credentials required
 */

const uploadToS3 = async (file) => {
  console.log("🪣 Mock S3 upload successful:", file.originalname);

  return {
    Location: `http://mock-s3.local/${Date.now()}-${file.originalname}`,
    Key: `${Date.now()}-${file.originalname}`,
    Bucket: "mock-bucket"
  };
};

const listImagesFromS3 = async () => {
  return [];
};

module.exports = {
  uploadToS3,
  listImagesFromS3
};
