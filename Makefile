.PHONY: all launch_server

REPO_DIR = $(shell pwd)
BIN_DIR = $(REPO_DIR)/bin
OUT_DIR = $(REPO_DIR)/docs

PORT := 9009

all:
	$(BIN_DIR)/update_url_postfix.py \
		-d $(OUT_DIR) \
		-f $(OUT_DIR)/regex/index.html

launch_server:
	python3 -m http.server -d docs $(PORT)
