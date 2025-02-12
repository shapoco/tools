SRC_APP_DIR = $(shell pwd)
OUT_APP_DIR = $(patsubst $(SRC_APP_BASE_DIR)/%, $(OUT_APP_BASE_DIR)/%, $(SRC_APP_DIR))

EXTRA_DEPENDENCIES += \
	$(wildcard $(SRC_APP_BASE_DIR)/*.mk)
