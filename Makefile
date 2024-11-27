# Установка зависимостей
install:
	npm install
	make -C frontend install

# Сборка проекта
build:
	rm -rf frontend/build
	make -C frontend build

# Запуск проекта
start:
	npx start-server -s ./frontend/build
