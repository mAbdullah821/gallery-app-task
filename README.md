# 📸 Gallery App

A modern, secure image gallery application built with NestJS, featuring JWT authentication, Google Cloud Storage integration, and comprehensive API documentation.

## ✨ Features

- **🔐 JWT Authentication**: Secure user authentication with access and refresh tokens
- **📤 Multiple Image Upload**: Upload up to 10 images simultaneously (5MB each)
- **☁️ Google Cloud Storage**: Reliable cloud storage for images
- **🔍 Advanced Filtering**: Filter images by creation date and file size
- **📄 Pagination**: Efficient pagination for large image collections
- **📚 API Documentation**: Interactive Swagger/OpenAPI documentation
- **🛡️ Type Safety**: Full TypeScript support with Prisma ORM
- **✅ Validation**: Comprehensive request validation with class-validator

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google Cloud Storage bucket
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd gallery-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   NODE_ENV=development
   PORT=23456
   DATABASE_URL="postgresql://username:password@localhost:5432/gallery_db"
   ACCESS_TOKEN_SECRET=your-access-token-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   ACCESS_TOKEN_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d
   DOCS_USER=admin
   DOCS_PASS=password
   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
   FILES_BUCKET_NAME=your-gcs-bucket-name
   ```

4. **Database setup**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the application**

   ```bash
   npm run start:dev
   ```

   The app will be available at `http://localhost:23456`

## 📖 API Documentation

Interactive API documentation is available at:

- **Swagger UI**: `http://localhost:23456/api`
- **Credentials**: Use the `DOCS_USER` and `DOCS_PASS` from your `.env` file

## 🔗 API Endpoints

### Authentication

- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login
- `POST /auth/refresh-tokens` - Refresh access token

### Images

- `POST /images/upload` - Upload multiple images (requires authentication)
- `GET /images` - Get paginated images with filters (requires authentication)
- `GET /images/:id` - Get specific image by ID (requires authentication)

### Query Parameters for GET /images

- `pageNumber` - Page number (default: 1)
- `pageSize` - Items per page (default: 20, max: 100)
- `createdAfter` - Filter images created after date (ISO 8601)
- `createdBefore` - Filter images created before date (ISO 8601)
- `minSize` - Minimum file size in bytes
- `maxSize` - Maximum file size in bytes

## 💻 Usage Examples

### Authentication

```bash
# Sign up
curl -X POST http://localhost:23456/auth/signup \
  -H "Content-Type: application/json" \
  -d '{ "name": "John Doe", "username":"john_doe","password":"securePassword123"}'

# Login
curl -X POST http://localhost:23456/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"securePassword123"}'
```

### Image Upload

```bash
# Upload multiple images
curl -X POST http://localhost:23456/images/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "images=@image1.jpg" \
  -F "images=@image2.png" \
  -F "images=@image3.gif"
```

### Get Images with Filters

```bash
# Get paginated images
curl "http://localhost:23456/images?pageNumber=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Filter by date and size
curl "http://localhost:23456/images?createdAfter=2024-01-01T00:00:00.000Z&minSize=1024" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files
├── helpers/          # Shared utilities
│   ├── auth/         # Authentication guards & strategies
│   ├── file/         # Google Cloud Storage service
│   └── prisma/       # Database service
└── modules/
    └── image/        # Image module
        ├── controller/   # API controllers
        ├── service/      # Business logic
        └── common/       # Shared interfaces & responses
```

## 🔧 Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **File Storage**: Google Cloud Storage
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript
