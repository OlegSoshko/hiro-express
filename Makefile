FRONTEND_DIR=frontend
FRONTEND_PORT=3001
FRONTEND_HOST=http://localhost

frontend-dev:
	npx live-server $(FRONTEND_DIR)/public

frontend-run:
	PORT=$(FRONTEND_PORT) node $(FRONTEND_DIR)/serve-frontend.js & sleep 1 && open $(FRONTEND_HOST):$(FRONTEND_PORT)

frontend-stop:
	kill $(shell lsof -t -i:$(FRONTEND_PORT))