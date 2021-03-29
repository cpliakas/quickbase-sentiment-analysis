# Quickbase Sentiment Analysis

An [AWS serverless app](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) that provides a sentiment analysis capability to [Quickbase](https://www.quickbase.com/) through [Pipelines](https://help.quickbase.com/pipelines/about_quick_base_pipelines.html).

## Installation

Sign in to the [AWS Management Console](https://aws.amazon.com/) and deploy the [quickbase-sentiment-analysis](https://us-east-2.console.aws.amazon.com/lambda/home?region=us-east-2#/create/app?applicationId=arn:aws:serverlessrepo:us-east-2:791865881004:applications/quickbase-sentiment-analysis) app from the [Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/).

Once the app is installed, create a Pipeline and use the [Webhooks Channel](https://help.quickbase.com/pipelines/webhooks_channel.html)'s `Make Request` action to consume the sentiment analysis service.

To get the settings required by the action, either log into the AWS Management Console and run the Lambda function with a name containing `FunctionMetadata`, or run the [settings.sh](settings.sh) script to invoke the Lambda function via the command line which downloads the settings to the `./settings.json` file.

The output of the Lambda function should resemble the JSON below:

```json
{
  "Authentication": "OAuth 2.0 Client Credentials",
  "Username": "6rg9jc3442gmkmhohjaav4bqll",
  "Password": "1k23bd7nqcaq3im5lrlph7oopv3sid23t5i7aorn3ecqucgmofs0",
  "TokenUrl": "https://my-domain-parameter.auth.us-east-2.amazoncognito.com/oauth2/token",
  "OauthCredentialsPlacement": "Header",
  "DisableSslCertificateValidation": "No",
  "Url": "https://x35vz3ks74.execute-api.us-east-2.amazonaws.com/Prod/",
  "Method": "POST",
  "BodyExample": "{{ {'text': a.textfield}|to_json }}"
}
```

## Usage

The serverless app provides an API that Pipelines consumes to detect sentiment. [Create a pipeline](https://help.quickbase.com/pipelines/creating_pipelines.html), and craft the json payload through the `Body` setting of the Webhooks Channel's `Make Request` action. An example of JSON payload that the API accepts is below:

```json
{
    "text": "This is a simple but useful application.",
    "language": "en"
}
```

Let's say the Pipeline's Step `A` is the Quickbase channel's `Record Created` action. Assuming you have a field named `Comment` in the table in which the record was created, you might build the json above by configuring the `Body` setting in the `Make Request` action to `{{ {'text': a.comment,'language':'en'}|to_json }}`.

On success, the API will return a response like the one below:

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

Assuming that the `Make Request` action happens in Step `B`, you can reference the sentiment in subsequent steps with `{{b.json.Sentiment}}`.
