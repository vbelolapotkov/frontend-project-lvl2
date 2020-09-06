install: install-deps

install-deps:
	npm ci

# Using dry-run to avoid real publishing of this demo package
publish:
	npm publish --dry-run

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8