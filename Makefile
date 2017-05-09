.PHONY: build watch clean

SHELL := /bin/bash
PATH := ./node_modules/.bin:$(PATH)

build: dist node_modules
	cp src/index.html dist/index.html
	cp src/AdobeVFPrototype.otf dist/AdobeVFPrototype.otf
	browserify src/app.js -o dist/out.js
	uglifyjs dist/out.js -c -m -o dist/out.js

watch: dist node_modules
	ln -sf $(shell pwd)/src/index.html dist/index.html
	watchify src/app.js -o dist/out.js -v

dist:
	mkdir -p dist

node_modules: package.json
	yarn

clean:
	rm -rf dist node_modules
