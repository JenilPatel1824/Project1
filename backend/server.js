// server.js

const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION // Replace with your DynamoDB region, e.g., 'us-east-1'
});

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB();

// Define a route to fetch data from DynamoDB
app.get('/data', (req, res) => {
    const params = {
        TableName: 'Owners' // Replace with your table name
        // Add other parameters as needed
    };

    // Call DynamoDB to retrieve data
    dynamodb.scan(params, (err, data) => {
        if (err) {
            console.error('Unable to retrieve data from DynamoDB', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data retrieved successfully', data);
            res.json(data);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
