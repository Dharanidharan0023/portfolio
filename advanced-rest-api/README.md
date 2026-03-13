# Advanced REST API

A professional, clean-architecture REST API built with Node.js, TypeScript, and Swagger.

## Features
- Clean Architecture (Controller, Service, Repository, Model)
- Robust Error Handling
- Schema Validation using Zod
- Interactive Swagger Documentation
- Security headers with Helmet
- CORS support

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## API Documentation
Once the server is running, visit: `http://localhost:3000/api-docs`

## Scripts
- `npm run dev`: Start dev server using `tsx`
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the compiled production server
