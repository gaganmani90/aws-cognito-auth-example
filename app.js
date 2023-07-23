// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cognitoAuth = require('./cognitoAuth'); // Import the cognitoAuth.js file

app.use(bodyParser.json());

// Route for user registration
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    cognitoAuth.registerUser(email, password, (err, username) => {
        if (err) {
            return res.status(500).json({ error: 'Error during registration' });
        }
        res.json({ message: 'Registration successful', username });
    });
});

// Route for user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    cognitoAuth.loginUser(email, password, (err, accessToken) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', accessToken });
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
