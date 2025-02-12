.PHONY: build test

build:
	@make --no-print-directory -C src/lib build
	@make --no-print-directory -C src/app/regex build

test:
	python3 -m http.server -d docs $(PORT)
