# Quickbase Sentiment Analysis

An [AWS serverless app](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) that provides a sentiment analysis capability to [Quickbase](https://www.quickbase.com/) through [Pipelines](https://help.quickbase.com/pipelines/about_quick_base_pipelines.html).

## Installation

Sign in to the AWS Management Console and deploy the [quickbase-sentiment-analysis](https://us-east-2.console.aws.amazon.com/lambda/home?region=us-east-2#/create/app?applicationId=arn:aws:serverlessrepo:us-east-2:791865881004:applications/quickbase-sentiment-anaalysis) app from the [Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/).

## Usage

### Getting the Client ID and Client Secret

Get the stack output by running the following command:

```
aws cloudformation describe-stacks --stack-name [StackName]
```

Get the User Pool ID and the User Pool Client ID from the following command:

```
aws cognito-idp describe-user-pool-client --user-pool-id [UserPoolId] --client-id [UserPoolClientId]
```

Find the `ClientId` and `ClientSecret` keys.

### With Pipelines

TODO

### API Only

The serverless app accepts a `POST` request to the `/` endpoint with the following payload:

```json
{
    "text": "This is a simple but useful application.",
    "language": "en"
}
```

The response below will be returned:

```json
{
    "Sentiment": "POSITIVE",
    "SentimentScore": {
        "Mixed": 0.001207727356813848,
        "Negative": 0.00012982868065591902,
        "Neutral": 0.000779111753217876,
        "Positive": 0.9978833794593811
    }
}
```
