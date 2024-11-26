# Линтинг фронтенда
lint-frontend:
	make -C frontend lint

# Установка зависимостей
install:
	npm ci
	make -C frontend install

# Запуск фронтенда
start-frontend:
	make -C frontend start

# Запуск бэкенда
start-backend:
	npx start-server -s ./frontend/dist

# Деплой на Heroku
deploy:
	git push heroku main

# Запуск только бэкенда
start:
	make start-backend

# Запуск для разработки
develop:
	make start-backend & make start-frontend

# Сборка фронтенда
build:
	rm -rf frontend/dist
	make -C frontend build
