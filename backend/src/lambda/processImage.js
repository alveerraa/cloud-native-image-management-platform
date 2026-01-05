module.exports.processImage = async (image) => {
  console.log("📸 Lambda triggered for image:", image);
  console.log("🧠 Simulating image compression / thumbnail");

  return {
    status: "processed",
    imageId: image.imageId
  };
};
