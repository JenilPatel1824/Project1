// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Use body-parser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Configure AWS SDK
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use a strong secret in production

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Define a route to fetch data from DynamoDB
app.get('/data', authenticateJWT, async (req, res) => { // Protect this route with JWT authentication
    const params = {
        TableName: 'Owners'
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        console.log('Data retrieved successfully', data);
        res.json(data);
    } catch (err) {
        console.error('Unable to retrieve data from DynamoDB', err);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route to handle signup requests
app.post('/signup', async (req, res) => {
    const { email, password, business, owner_id } = req.body; // Use body for POST data

    if (!email || !password || !business || !owner_id) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the parameters for the PutCommand
    const params = {
        TableName: 'Owners', // Replace with your table name
        Item: {
            'owner_id': owner_id,
            'email': email,
            'password': hashedPassword,
            'business': business
        }
    };

    try {
        await ddbDocClient.send(new PutCommand(params));
        console.log('Signup successful');
        res.status(201).json({ message: 'Signup successful!' });
    } catch (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to handle login requests using owner_id and password
app.post('/login', async (req, res) => {
    const { owner_id, password } = req.body;

    if (!owner_id || !password) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Fetch the user from DynamoDB
    const params = {
        TableName: 'Owners',
        Key: {
            'owner_id': owner_id
        }
    };

    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        if (!data.Item) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = data.Item;

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT
        const token = jwt.sign({ owner_id: user.owner_id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/create-form', async (req, res) => {
    try {
        // Generate a unique form ID
        const formId = generateUniqueId();

        // Save form details
        await saveFormDetails(formId, req.body);

        // Save form specifications
        await saveFormSpecifications(formId, req.body.specifications);

        res.status(201).send('Form created successfully');
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function saveFormDetails(formId, formData) {
    const params = {
        TableName: 'Forms',
        Item: {

            formId: formId,
            owner_id: formData.owner_id,
            formName: formData.formName,
            formType: formData.formType,
            formEndDate: formData.formEndDate
        }
    };

    await dynamodb.put(params).promise();
}

async function saveFormSpecifications(formId, formSpecifications) {
    const params = {
        TableName: 'FormSpecifications',
        Item: {
            formId: formId,
            specifications: formSpecifications
        }
    };

    await dynamodb.put(params).promise();
}
function generateUniqueId() {
    // Implement your logic to generate a unique ID here
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
