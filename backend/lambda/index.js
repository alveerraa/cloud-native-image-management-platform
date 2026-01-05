exports.handler = async (event) => {
  console.log("🔥 Lambda triggered");
  console.log("Image ID:", event.imageId);

  return {
    statusCode: 200,
    body: "Lambda processed image"
  };
};
