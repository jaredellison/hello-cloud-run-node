include .env
export

GIT_SHA := `git log --pretty=format:'%h8' -1 HEAD`
CONTAINER_IMAGE_NAME := ${GCP_CONTAINER_REGISTRY_HOSTNAME}/${GCP_PROJECT_ID}/${GCP_TARGET_IMAGE_NAME}:${GIT_SHA}

# ---------------------------------------- #
# Docker Build Commands
# ---------------------------------------- #
docker-build:
	bash -c 'test -z "$$(git status --porcelain)" && exit 0 || echo "Please commit changes before building and tagging an image." && exit 1;'
	docker build . --tag ${CONTAINER_IMAGE_NAME} --platform linux/amd64

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
# Terraform Commands
# ---------------------------------------- #

terraform-init:
	cd ./config && terraform init

terraform-validate:
	cd ./config && terraform validate

terraform-plan:
	cd ./config && terraform plan

terraform-apply:
	cd ./config && terraform apply