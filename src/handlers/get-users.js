
// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;


exports.getUsers = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accepts GET method`);
  }

  console.info('received:', event);

  // Get all items from the table
  let response = {};

  try {
    const params = {
      TableName: tableName,
    };
    const data = await docClient.scan(params).promise();

    const items = data.Items;

    response = {
      statusCode: 200,
      body: JSON.stringify(items),
    };

  } catch (error) {
    console.error("Error:", error);
    response = {
      statusCode: 500,
      body: "Internal Server Error.",
    };
  }

  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
};
