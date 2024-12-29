# 🚀 Next-Auth Starter

A **modern, feature-rich starter project** for building Next.js applications with authentication, database integration, and beautifully designed UI components.

---

## ✨ Features

- 🔒 **Authentication**: Easily integrate Google, GitHub, and LinkedIn with NextAuth.js.
- 📦 **Database Integration**: Prisma ORM supporting PostgreSQL (via Prisma Accelerate) and MongoDB.
- 🎨 **Modern UI**: Powered by Radix UI and styled with TailwindCSS.
- 🛠️ **Developer Tools**: TypeScript, ESLint, and Prettier for clean and maintainable code.
- ⚡ **State Management**: React Query for fast and efficient data fetching.

---

## 🛠️ Prerequisites

Ensure you have the following installed:
- **Node.js**: v16 or higher
- **npm**: v7 or higher

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
$ git clone https://github.com/your-repo/next-auth-starter.git
$ cd next-auth-starter
```

### 2. Install Dependencies

To handle peer dependency conflicts, use:
```bash
$ npm run install:legacy
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and add the following:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
DATABASE_URL=your_prisma_database_url
DIRECT_URL=your_direct_mongo_connection
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
NEXT_PUBLIC_IMAGE_UPLOAD_URL=your_image_upload_url
```

### 4. Run Database Migrations

```bash
$ npx prisma migrate dev
```

### 5. Start the Development Server

```bash
$ npm run dev
```

Access the application at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
├── components/       # Reusable UI components
├── pages/            # Next.js routes
├── prisma/           # Prisma schema and migrations
├── public/           # Public assets
├── styles/           # Global styles
├── utils/            # Utility functions
└── .env.local        # Environment variables
```

---

## 📜 Scripts

- **`npm run dev`**: Start the development server with Turbopack.
- **`npm run build`**: Build the application for production.
- **`npm run start`**: Start the application in production mode.
- **`npm run lint`**: Run ESLint checks.
- **`npm run install:legacy`**: Install dependencies with legacy peer dependency resolution.
- **`npm run postinstall`**: Generate Prisma client after installing dependencies.

---

## 🌍 Deployment

### Steps to Deploy:

1. Set environment variables on your hosting platform.
2. Build the project:
   ```bash
   $ npm run build
   ```
3. Start the server:
   ```bash
   $ npm run start
   ```

---

## 🛠️ Technologies Used

- **Next.js**: Framework for server-rendered React applications.
- **NextAuth.js**: Flexible authentication for Next.js.
- **Prisma**: Database ORM for PostgreSQL and MongoDB.
- **TailwindCSS**: Utility-first CSS framework.
- **Radix UI**: Accessible, high-quality components.
- **React Query**: Powerful data fetching and caching.
- **Zod**: Type-safe schema validation.

---

