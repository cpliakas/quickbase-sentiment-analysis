var process = require('process');
var AWS = require('aws-sdk');
var cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context) => {
    client = await describeUserPoolClient()
    return {
        Authentication: 'OAuth 2.0 Client Credentials',
        Username: client.UserPoolClient.ClientId,
        Password: client.UserPoolClient.ClientSecret,
        TokenUrl: process.env.TOKEN_ENDPOINT,
        OauthCredentialsPlacement: 'Header',
        DisableSslCertificateValidation: 'No',
        Url: process.env.API_ENDPOINT,
        Method: 'POST',
        BodyExample: '{{ {\'text\': a.textfield}|to_json }}'
    }
}

var describeUserPoolClient = function () {
    params = {
        UserPoolId: process.env.USER_POOL_ID,
        ClientId: process.env.USER_POOL_CLIENT_ID,
    };
    return cognito.describeUserPoolClient(params).promise()
}
