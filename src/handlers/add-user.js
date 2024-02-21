
const { v4: uuidv4 } = require('uuid')
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.SAMPLE_TABLE;


exports.addUser = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method`);
    }
    console.info('received:', event);

    // Generate id by uuid
    const body = JSON.parse(event.body);
    const id = uuidv4();
    const name = body.name;

    let response = {};

    try {
        const params = {
            TableName : tableName,
            Item: { PK : id, name: name }
        };
    
        const result = await docClient.put(params).promise();
    
        response = {
            statusCode: 200,
            body: JSON.stringify(body)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Unable to call DynamoDB. Table resource not found."
        };
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
