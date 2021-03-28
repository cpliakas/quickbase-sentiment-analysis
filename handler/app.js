var AWS = require('aws-sdk');
var comprehend = new AWS.Comprehend();

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.handler = async (event, context) => {
    try {
        let sentiment = await detectSentiment()
        return formatResponse(serialize(sentiment))
    } catch (error) {
        return formatError(error)
    }
};

var detectSentiment = function () {
    params = {
        LanguageCode: 'en',
        Text: 'This is the best code I have ever seen.'
    };
    return comprehend.detectSentiment(params).promise()
}

var serialize = function (object) {
    return JSON.stringify(object, null, 2)
}

var formatResponse = function (body) {
    var response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "isBase64Encoded": false,
        "body": body
    }
    return response
}

var formatError = function (error) {
    var response = {
        "statusCode": error.statusCode,
        "headers": {
            "Content-Type": "text/plain",
            "x-amzn-ErrorType": error.code
        },
        "isBase64Encoded": false,
        "body": error.code + ": " + error.message
    }
    return response
}
