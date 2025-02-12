SRC_DIR = $(REPO_DIR)/src
OUT_DIR = $(REPO_DIR)/docs
BIN_DIR = $(REPO_DIR)/bin

SRC_LIB_DIR = $(REPO_DIR)/src/lib
OUT_LIB_DIR = $(OUT_DIR)/lib

SRC_APP_BASE_DIR = $(REPO_DIR)/src/app
OUT_APP_BASE_DIR = $(OUT_DIR)/app

EXTRA_DEPENDENCIES = \
	$(REPO_DIR)/Makefile \
	$(wildcard $(REPO_DIR)/*.mk) 

TSC_FLAGS = \
	--module es6 \
	--target es5 \
	--lib es2021,dom,dom.iterable
