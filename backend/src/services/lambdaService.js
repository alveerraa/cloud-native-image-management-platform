const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambda = new LambdaClient({
  region: "us-east-1",
  endpoint: "http://localstack:4566", // 👈 REQUIRED
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

async function invokeImageLambda(imageId) {
  await lambda.send(
    new InvokeCommand({
      FunctionName: "processImage", // 👈 NO ARN, NO :$LATEST
      InvocationType: "Event", // async fire-and-forget
      Payload: Buffer.from(JSON.stringify({ imageId })),
    })
  );

  console.log("🚀 Lambda invoked for imageId:", imageId);
}

module.exports = { invokeImageLambda };
