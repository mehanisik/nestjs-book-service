# Book Service API

This is a NestJS-based API for managing books. It focuses on CRUD  operations for books, secured with JWT authentication and uses Cloudinary for image uploads.

## Features

- Authentication(JWT)
- CRUD for books
- Image Upload(Coudinary)
- Swagger API
- PostgreSQL db with TypeORM
- Docker support

## Documentation

The API documentation is available through Swagger UI when running the application:

```bash
http://localhost:8000/api/swagger
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nestjs-book-service.git
cd nestjs-book-service
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=8000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=book_service

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=book-covers
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

### Authentication

#### Register User
```http
POST /auth/register
```

| Parameter  | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `email`    | `string` | **Required**. User's email    |
| `username` | `string` | **Required**. User's username |
| `password` | `string` | **Required**. User's password |

#### Login
```http
POST /auth/login
```

| Parameter  | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `email`    | `string` | **Required**. User's email    |
| `password` | `string` | **Required**. User's password |

### Books

#### Get All Books
```http
GET /books
```

| Header     | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

#### Get Book by ID
```http
GET /books/:id
```

| Parameter  | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `id`       | `string` | **Required**. Book's UUID     |
| `Authorization` | `string` | **Required**. Bearer token |

#### Create Book
```http
POST /books
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
PATCH /books/:id
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
DELETE /books/:id
```

| Parameter  | Type     | Description                    |
| :--------  | :------- | :---------------------------- |
| `id`       | `string` | **Required**. Book's UUID     |
| `Authorization` | `string` | **Required**. Bearer token |

