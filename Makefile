
component = ./node_modules/.bin/component
cordova = ./node_modules/.bin/cordova
myth = ./node_modules/.bin/myth

build: node_modules components index.js index.css $(shell find lib)
	@mkdir -p www
	@$(component) build --dev --standalone graph --out www
	@$(myth) www/build.css www/build.css
	@cp config.xml www/config.xml
	@cp index.html www/index.html
	@$(cordova) build

clean:
	@rm -rf www components

components: node_modules component.json $(shell find . -name component.json)
	@$(component) install --dev

emulate: build
	@$(cordova) emulate ios

init: node_modules
	@$(cordova) platform add ios

node_modules: package.json
	@npm install
	@touch package.json

serve:
	$(cordova) serve 4200

test: build
	echo "no tests yet..."

.PHONY: clean test