# hello-cloud-run-node

> Code, commands and configuration for deploying a node service on Google Cloud Platform's Cloud Run

# Running Locally

Ensure you have `nvm` and `yarn` installed.

```bash
## Install dependencies
$ yarn

## Start server
$ yarn dev
```

# Deploying

Create a [Google Cloud Project](https://developers.gooagle.com/workspace/guides/create-project) for your code to run in and create a new file `.env` based on `.env-example`. Ensure you have docker installed and running on your machine.

```bash
# Create a docker image, push it to a registry and start the service
$ make gcloud-first-deploy
```
