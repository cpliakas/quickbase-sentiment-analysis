# Configure the build by setting the environment variables below.
# The default values should allow you to create a development stack.
APP_NAME ?= quickbase-sentiment-analysis
APP_STAGE ?= $(USER)
AWS_REGION ?= $(aws configure get region)
AUTH_STACK_NAME ?= $(APP_NAME)-$(APP_STAGE)

# Common values used throughout the Makefile, not intended to be configured.
S3_BUCKET = $(APP_NAME)-code-$(AWS_REGION)-$(APP_STAGE)
STACK_NAME = $(APP_NAME)-$(APP_STAGE)
PACKAGED_TEMPLATE = packaged.yaml
TEMPLATE = template.yaml
TEMPLATE_PARAMS = Domain=$(STACK_NAME)

.PHONY: build
build:
	(cd function && npm install)

.PHONY: run
run:
	sam local start-api

.PHONY: code-bucket
code-bucket:
	aws s3 mb s3://$(S3_BUCKET)

.PHONY: package
package:
	sam package --template-file $(TEMPLATE) --s3-bucket $(S3_BUCKET) --output-template-file $(PACKAGED_TEMPLATE)

.PHONY: deploy
deploy: package
	sam deploy --template-file $(PACKAGED_TEMPLATE) --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --parameter-overrides $(TEMPLATE_PARAMS)

.PHONY: teardown
teardown:
	aws cloudformation delete-stack --stack-name $(STACK_NAME)

.PHONY: clean
clean:
	rm -f $(PACKAGED_TEMPLATE)
