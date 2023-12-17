## Перед запуском

Перед запуском важно заполнить конфиг (.development.env)
P.S. можно использовать поля из example.env

## Миграции
```bash
# Просмотр статуса миграций
$ npm run migration:status

# Запуск миграций
$ npm run migration:run

# Откат последней миграции
$ npm run migration:undo
```

## Загрузка зависимостей

```bash
$ npm install
```

## Запуск приложения

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```