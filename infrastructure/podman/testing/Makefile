PROJECT_NAME=vc_test

internal-up:
	INTERNAL=true USER_API_PORT=3100 RABBITMQ_PORT=5173 RABBITMQ_MANAGEMENT_PORT=15673 podman-compose -f compose.yml -p $(PROJECT_NAME) up -d

internal-down:
	podman-compose -f compose.yml -p $(PROJECT_NAME) down --volumes

internal-build-all:
	podman-compose -f compose.yml -p $(PROJECT_NAME) build
