.PHONY: build

REPO_DIR = $(shell cd ../.. && pwd)
include $(REPO_DIR)/config.mk

SRC_LIB_TS_DIR = $(SRC_LIB_DIR)/ts

BUILD_DIR = $(SRC_LIB_TS_DIR)/.build

TS_LIST = $(wildcard $(SRC_LIB_TS_DIR)/src/*.ts)

APP_JS = $(OUT_LIB_DIR)/app.js

EXTRA_DEPENDENCIES += \
	Makefile

build: $(APP_JS)

$(APP_JS): $(TS_LIST) $(EXTRA_DEPENDENCIES)
	@mkdir -p $(shell dirname $@)
	@rm -rf $(BUILD_DIR)/*
	cd $(SRC_LIB_TS_DIR) && tsc
	cp -f $(BUILD_DIR)/src/*.js $(OUT_LIB_DIR)/.

