exports.handler = async (event) => {
  console.log("Image uploaded:", event);
  return { statusCode: 200 };
};
