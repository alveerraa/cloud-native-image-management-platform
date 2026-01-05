const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

module.exports = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: "http://localstack:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test"
  }
});
