terraform {
  required_version = ">= 1.3.9"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.59.0"
    }
  }
}

data "external" "git" {
  program = [
    "git",
    "log",
    "--pretty=format:{ \"sha\": \"%H\" }",
    "-1",
    "HEAD"
  ]
}

provider "google" {
  project = var.gcp_project
}

# Enables the Cloud Run API
resource "google_project_service" "run_api" {
  project = var.gcp_project
  service = "run.googleapis.com"

  disable_on_destroy = true
}

# Create the Cloud Run service
resource "google_cloud_run_service" "run_service" {
  name     = var.gcp_cloud_run_service_name
  location = var.gcp_region

  template {
    spec {
      containers {
        image = format("%s/%s/%s:latest",
          var.gcp_container_registry_host,
          var.gcp_project,
          var.gcp_target_image_name
        )
        env {
          name  = "IS_GCP"
          value = "true"
        }
        env {
          name  = "GCP_PROJECT_ID"
          value = var.gcp_project
        }
        env {
          name  = "GIT_VERSION"
          value = substr(data.external.git.result.sha, 0, 8)
        }
        env {
          name  = "SERVICE_NAME"
          value = var.gcp_cloud_run_service_name
        }
      }
    }
    metadata {
      annotations = {
        # Scale down to zero to limit costs
        "autoscaling.knative.dev/minScale" = 0
        # Limit scaling to prevent unexpected cost
        "autoscaling.knative.dev/maxScale" = 10
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # Waits for the Cloud Run API to be enabled
  depends_on = [google_project_service.run_api]
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.run_service.name
  location = google_cloud_run_service.run_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_url" {
  description = "Cloud run service URL"
  value       = google_cloud_run_service.run_service.status[0].url
}
