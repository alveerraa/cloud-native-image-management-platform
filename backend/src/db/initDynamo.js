const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localstack:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test"
  }
});

async function initDynamo() {
  try {
    await client.send(new DescribeTableCommand({ TableName: "Images" }));
    console.log("✅ DynamoDB table already exists");
  } catch (err) {
    if (err.name === "ResourceNotFoundException") {
      console.log("⚠️ DynamoDB table not found. Creating...");

      await client.send(new CreateTableCommand({
        TableName: "Images",
        AttributeDefinitions: [
          { AttributeName: "imageId", AttributeType: "S" }
        ],
        KeySchema: [
          { AttributeName: "imageId", KeyType: "HASH" }
        ],
        BillingMode: "PAY_PER_REQUEST"
      }));

      console.log("✅ DynamoDB table created");
    } else {
      throw err;
    }
  }
}

module.exports = initDynamo;
