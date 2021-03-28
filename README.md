# Quickbase Sentiment Analysis

The project provides a sentiment analysis capability to [Quickbase](https://www.quickbase.com/) through [Pipelines](https://help.quickbase.com/pipelines/about_quick_base_pipelines.html) and an AWS serverless application.

## Installation

TODO

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

The serverless app accepts a POST request to `/` with the following payload:

```json
{
    "text": "This is a simple but useful application."
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
