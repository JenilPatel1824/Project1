// Load environment variables from .env file
require('dotenv').config();

// Import the AWS SDK v3
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

// Set the region from environment variables
const REGION = process.env.AWS_REGION;

// Create an AWS DynamoDB client
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// Create a table
const createTable = async () => {
    const params = {
        TableName: 'ExampleTable',
        KeySchema: [
            { AttributeName: 'ID', KeyType: 'HASH' },  // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: 'ID', AttributeType: 'N' },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
        },
    };

    try {
        const data = await client.send(new CreateTableCommand(params));
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    }
};

// Function to put an item
const putItem = async () => {
    const params = {
        TableName: 'ExampleTable',
        Item: {
            'ID': 1,
            'Name': 'John Doe',
            'Age': 30
        }
    };

    try {
        const data = await docClient.send(new PutCommand(params));
        console.log("Added item:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    }
};

// Function to get an item
const getItem = async () => {
    const params = {
        TableName: 'ExampleTable',
        Key: {
            'ID': 1
        }
    };

    try {
        const data = await docClient.send(new GetCommand(params));
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    }
};

// Create the table, put an item, and get the item
const run = async () => {
    await createTable();

    // Wait for a while to ensure the table is created before inserting and reading data
    setTimeout(async () => {
        await putItem();
        setTimeout(getItem, 2000); // wait for the item to be inserted before reading it
    }, 5000);
};

run();
