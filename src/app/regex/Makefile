.PHONY: build

REPO_DIR = $(shell cd ../../.. && pwd)
include $(REPO_DIR)/config.mk
include $(SRC_APP_BASE_DIR)/app.mk

SRC_APP_BASE_DIR = $(SRC_DIR)/app

SRC_APP_TS_DIR = $(SRC_APP_DIR)/ts
BUILD_DIR = $(SRC_APP_TS_DIR)/.build

TS_LIST = $(wildcard $(SRC_APP_TS_DIR)/src/*.ts)

MAIN_JS = $(OUT_APP_DIR)/core.js

EXTRA_DEPENDENCIES += \
	Makefile

build: $(MAIN_JS)

$(MAIN_JS): $(TS_LIST) $(EXTRA_DEPENDENCIES)
	@mkdir -p $(shell dirname $@)
	@rm -rf $(BUILD_DIR)/*
	cd $(SRC_APP_TS_DIR) && tsc
	cp -f $(BUILD_DIR)/*.js $(OUT_APP_DIR)/.

