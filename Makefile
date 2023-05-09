include .env
export

CONTAINER_IMAGE_NAME := ${GCP_CONTAINER_REGISTRY_HOSTNAME}/${GCP_PROJECT_ID}/${GCP_TARGET_IMAGE_NAME}:latest

# ---------------------------------------- #
# Docker Build Commands
# ---------------------------------------- #
docker-build:
	docker build . --tag ${CONTAINER_IMAGE_NAME}

docker-run:
	docker run --name ${GCP_TARGET_IMAGE_NAME} -d -p 3000:3000 ${CONTAINER_IMAGE_NAME}

docker-stop:
	docker stop ${GCP_TARGET_IMAGE_NAME}

docker-push:
	docker push ${CONTAINER_IMAGE_NAME}

docker-clean:
	docker image rm $(CONTAINER_IMAGE_NAME)
	docker container rm $(CONTAINER_IMAGE_NAME)

# ---------------------------------------- #
# Cloud Run Deployment Commands
# ---------------------------------------- #
gcloud-deploy:
	gcloud run deploy ${GCP_SERVICE_NAME} \
		--min-instances 0 \
		--max-instances 1 \
		--region ${GCP_REGION} \
		--image ${CONTAINER_IMAGE_NAME} \
		--allow-unauthenticated \
		--set-env-vars GCP_PROJECT_ID=${GCP_PROJECT_ID},IS_GCP=${IS_GCP}

gcloud-service-delete:
	gcloud run services delete ${GCP_SERVICE_NAME} \
		--region ${GCP_REGION} \
		--quiet

gcloud-container-delete:
	gcloud container images delete ${CONTAINER_IMAGE_NAME}\
		--quiet

gcloud-first-deploy: docker-build docker-push gcloud-deploy

gcloud-rebuild: gcloud-clean docker-build docker-push gcloud-deploy

gcloud-clean: gcloud-service-delete gcloud-container-delete