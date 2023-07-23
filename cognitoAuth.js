// cognitoAuth.js
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

// AWS Cognito configuration
const poolData = {
    UserPoolId: 'your_user_pool_id',
    ClientId: 'your_app_client_id'
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Function for user registration
function registerUser(email, password, callback) {
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email })
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
            console.error('Error during registration:', err);
            return callback(err);
        }
        const cognitoUser = result.user;
        console.log('User registered:', cognitoUser.getUsername());
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

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
            console.log('User authenticated:', session);
            const accessToken = session.getAccessToken().getJwtToken();
            callback(null, accessToken);
        },
        onFailure: (err) => {
            console.error('Error during login:', err);
            callback(err);
        }
    });
}

module.exports = {
    registerUser,
    loginUser
};
