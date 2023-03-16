include .env
export

CONTAINER_IMAGE_NAME := ${GCP_CONTAINER_REGISTRY_HOSTNAME}/${GCP_PROJECT_ID}/${GCP_TARGET_IMAGE_NAME}:latest

# ---------------------------------------- #
# Docker Build Commands
# ---------------------------------------- #
docker-build:
	docker build -t ${CONTAINER_IMAGE_NAME} .

docker-push:
	docker push ${CONTAINER_IMAGE_NAME}

docker-clean:
	docker image rm $(CONTAINER_IMAGE_NAME)

# ---------------------------------------- #
# Test Execution Commands
# ---------------------------------------- #
# make run-basic-reqeust K6_VUS=5000 K6_DURATION=30s K6_TEST_URL=http://example.com/
run-basic-reqeust:
	docker run -e K6_VUS=${K6_VUS} \
		-e K6_DURATION=${K6_DURATION} \
		-e K6_TEST_URL=${K6_TEST_URL} \
		-e K6_SCRIPT=basic-request.js \
		${CONTAINER_IMAGE_NAME}