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
        let body = parseBody(event)
        let sentiment = await detectSentiment(body)
        return formatResponse(serialize(sentiment))
    } catch (error) {
        return formatError(error)
    }
};

var parseBody = function (event) {
    let body = JSON.parse(event.body)
    if (!body) {
        throw new Error("payload required")
    }
    if (!body.text) {
        throw new Error("text key required in payload")
    }
    return body
}

var detectSentiment = function (body) {
    params = {
        LanguageCode: body.language || 'en',
        Text: body.text
    };
    return comprehend.detectSentiment(params).promise()
}

var serialize = function (object) {
    return JSON.stringify(object, null, 2)
}

var formatResponse = function (response) {
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "isBase64Encoded": false,
        "body": response
    }
}

var formatError = function (err) {
    if (err.code) {
        return {
            "statusCode": err.statusCode,
            "headers": {
                "Content-Type": "application/json",
                "x-amzn-ErrorType": err.code
            },
            "isBase64Encoded": false,
            "body": JSON.stringify({Message: err.code + ": " + err.message})
        }
    } else {
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
            },
            "isBase64Encoded": false,
            "body": JSON.stringify({Message: err.toString()})
        }
    }
}
