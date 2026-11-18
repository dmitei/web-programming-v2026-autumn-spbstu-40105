.PHONY: backend frontend oapi-codegen openapi-types

backend:
	cd backend && go run ./cmd

frontend:
	cd frontend && npm run dev

oapi-codegen:
	cd backend && go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.8.0 --config oapi-codegen.yaml ../swagger/openapi.yaml

openapi-types:
	cd frontend && npm run types
