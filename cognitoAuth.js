
// cognitoAuth.js
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const logger = require("./configuration/logger");
require('dotenv').config();
const CryptoJS = require('crypto-js');

// AWS Cognito configuration
const poolData = {
    UserPoolId: process.env.AWS_USER_POOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID
};
logger.info(`pool data: +${JSON.stringify(poolData)}`);
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function for user registration
function registerUser(email, password, callback) {
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email })
    ];
    logger.info(`Register user: attributeList ${JSON.stringify(attributeList)}`)

    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
            console.error('Error during registration:', err);
            return callback(err);
        }
        const cognitoUser = result.user;
        logger.info('User registered:', cognitoUser.getUsername());
        callback(null, cognitoUser.getUsername());
    });
}

// Function for user login
function loginUser(email, password, callback) {
    const authenticationData = {
        Username: email,
        Password: password
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
        Username: email,
        Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    // Calculate the SECRET_HASH
    const secretHash = calculateSecretHash(poolData.ClientId, poolData.ClientSecret, email);

    // Include the SECRET_HASH in the authentication parameters
    const authenticationParameters = {
        Username: email,
        Password: password,
        SecretHash: secretHash,
    };

    logger.info(`login auth params: ${JSON.stringify(authenticationParameters)}`)

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
            logger.info('User authenticated:', session);
            const accessToken = session.getAccessToken().getJwtToken();
            callback(null, accessToken);
        },
        onFailure: (err) => {
            logger.error('Error during login:', err);
            callback(err);
        },
    });
}

// Function to calculate SECRET_HASH
function calculateSecretHash(clientId, clientSecret, username) {
    const strToSign = username + clientId;
    const hash = CryptoJS.MD5(strToSign, clientSecret);
    return hash.toString(CryptoJS.enc.Base64);
}

module.exports = {
    registerUser,
    loginUser
};
