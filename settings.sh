#!/bin/sh

stack_name=serverlessrepo-quickbase-sentiment-analysis

func=$(aws cloudformation describe-stacks --query "Stacks[0].Outputs[?OutputKey=='MetadataFunction'].OutputValue | [0]" --output text --stack-name ${stack_name})
aws lambda invoke --function-name $func settings.json
