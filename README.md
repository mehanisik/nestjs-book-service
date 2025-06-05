# Nestjs Book Service API

This is a NestJS-based API for managing books. It focuses on CRUD  operations for books, secured with JWT authentication and uses Cloudinary for image uploads.

## Features

- Authentication(JWT)
- Image Upload(Coudinary)
- Swagger API
- PostgreSQL db with TypeORM
- Docker
- Biome.json
- Commitlint with Husky


## Documentation

The API documentation is available through Swagger UI when running the application:

```bash
http://localhost:8000/api/swagger
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mehanisik/nestjs-book-service.git
cd nestjs-book-service
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=local
APP_PORT=8000
APP_URL=http://localhost:8000
APP_NAME=nestjs_book_api
APP_VERSION=1.0.0
APP_CORS_ORIGIN=http://localhost:3000

APP_JWT_SECRET=
APP_JWT_EXPIRATION=

DATABASE_URL= 

CLOUDINARY_URL=
CLOUDINARY_FOLDER=
```

## Run Locally

### Using Docker (Recommended)

1. Build and start the containers:
```bash
docker compose up -d
```

2. Stop the containers:
```bash
docker compose down
```

3. View logs:
```bash
docker compose logs -f
```

4. Rebuild containers (after dependency changes):
```bash
docker compose up -d --build
```

### Without Docker

Development mode:
```bash
pnpm run start:dev
```

Production mode:
```bash
pnpm run build
pnpm run start:prod
```

## Testing

Run unit tests:
```bash
pnpm run test
```

## API Reference

The rest api is uses the /api prefix for each endpoint except swagger and also JWT Bearer token as header

### Authentication

#### Register User
```http
POST /api/auth/sign-up
```

| Parameter  | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `email`    | `string` | **Required**  |
| `username` | `string` | **Required**  |
| `password` | `string` | **Required**  |
| `confirmPassword` | `string` | **Required**.|

#### Login
```http
POST /api/auth/sign-in
```

| Parameter  | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `email`    | `string` | **Required**    |
| `password` | `string` | **Required** |

### Books

#### Get All Books
```http
GET api/books
```

| Header     | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Get Book by ID
```http
GET api/books/:id
```

| Parameter  | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `id`       | `string` | **Required**. Book's UUID     |
| `Authorization` | `string` | **Required**. Bearer token |

#### Create Book
```http
POST api/books
```

| Parameter     | Type     | Description                    |
| :--------     | :------- | :---------------------------- |
| `title`       | `string` | **Required**. Book's title    |
| `author`      | `string` | **Required**. Book's author   |
| `year`        | `number` | **Required**. Publication year|
| `description` | `string` | Optional. Book's description  |
| `coverImage`  | `file`   | Optional. Book's cover image  |
| `Authorization` | `string` | **Required**. Bearer token |

#### Update Book
```http
PATCH api/books/:id
```

| Parameter     | Type     | Description                    |
| :--------     | :------- | :---------------------------- |
| `id`          | `string` | **Required**. Book's UUID     |
| `title`       | `string` | Optional. Book's title        |
| `author`      | `string` | Optional. Book's author       |
| `year`        | `number` | Optional. Publication year    |
| `description` | `string` | Optional. Book's description  |
| `coverImage`  | `file`   | Optional. Book's cover image  |
| `Authorization` | `string` | **Required**. Bearer token |

#### Delete Book
```http
DELETE api/books/:id
```

| Parameter  | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `id`       | `string` | **Required**. Book's UUID     |
| `Authorization` | `string` | **Required**. Bearer token |

