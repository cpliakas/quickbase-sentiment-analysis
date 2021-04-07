# Quickbase Sentiment Analysis

An [AWS serverless app](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) that provides a sentiment analysis capability to [Quickbase](https://www.quickbase.com/) through [Pipelines](https://help.quickbase.com/pipelines/about_quick_base_pipelines.html).

## Installation

View the [end-to-end walkthrough](https://www.youtube.com/watch?v=2QH7PNAFGTY) to install and configure everything needed to add sentiment analysis to your Quickbase applications.

To install the Amazon services, sign in to the [AWS Management Console](https://aws.amazon.com/) and deploy the [quickbase-sentiment-analysis](https://us-east-2.console.aws.amazon.com/lambda/home?region=us-east-2#/create/app?applicationId=arn:aws:serverlessrepo:us-east-2:791865881004:applications/quickbase-sentiment-analysis) app from the [Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/). You may also take the steps detailed in the [Development](#development) section to install the Amazon services using the SAM framework outside of the Serverless Application Repository model.

Quickbase requires [basic schema](https://help.quickbase.com/user-assistance/adding_child_databases.html) and a [Pipeline](https://help.quickbase.com/pipelines/creating_pipelines.html) as detailed in the end-to-end walkthrough video.

## Usage

The serverless app provides an API that Pipelines consumes to detect sentiment. [Create a pipeline](https://help.quickbase.com/pipelines/creating_pipelines.html), and craft the json payload through the `Body` setting of the `Webhooks Channel`'s `Make Request` action. An example of JSON payload that the API accepts is below:

```json
{
    "text": "This is a simple but useful application.",
    "language": "en"
}
```

Let's say the Pipeline's Step `A` is the `Quickbase` channel's `Record Created` action. Assuming you have a field named `Comment` in the table in which the record was created, you might build the json above by configuring the `Body` setting in the `Make Request` action to `{{ {'text': a.comment,'language':'en'}|to_json }}`.

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

## Development

Suppose you wish to develop additional features or modify and host the application outside of the Serverless Application Repository workflow. In that case, this project contains tools to make it easy to do so.

First, install the prerequisites below:

* [An AWS account](https://aws.amazon.com/)
* [Docker](https://docs.docker.com/install)
* [Node.js](https://nodejs.org/en/download/)
* [AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)
* [SAM CLI](https://aws.amazon.com/serverless/sam/)
* [jq](https://stedolan.github.io/jq/) (optional)

The project includes a [Makefile](Makefile) to set up, deploy, and teardown the application. Reference the targets in the `Makefile` as documentation for underlying commands.

First, clone the repository.

```
git clone git@github.com:cpliakas/quickbase-sentiment-analysis.git
cd ./quickbase-sentiment-analysis
```

Then, create the bucket that will host your code:

```
make bucket
```

You are now ready to deploy the application.

```
make deploy
```

Once the stack is created, run the `settings` target to download the `settings.json` file that contains the Pipelines configuration.

```
make settings
```

Tear down the application after you are finished working with it.

```
make teardown
```

The defaults are suitable for setting up a development environment. You can configure the `Makefile` by setting the following environment variables:

* `APP_NAME`: The CloudFormation stack name prefix, defaults to `quickbase-sentiment-analysis`
* `APP_STAGE`: The CloudFormation stack name suffix, defaults to the `USER` environment variable
* `AWS_REGION`: Defaults to the output of the `aws configure get region` command
