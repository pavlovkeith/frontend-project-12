install:
	npm install
	make -C frontend install

build:
	rm -rf frontend/dist
	make -C frontend build
