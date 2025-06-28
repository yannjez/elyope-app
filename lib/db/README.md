# @elyope/db

Database package using Prisma ORM with PostgreSQL.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up your environment variables in `.env`:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/elyope_db?schema=public"
   ```

3. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

4. Run database migrations (when ready):
   ```bash
   npx prisma migrate dev
   ```

## Usage

Import the Prisma client in your application:

```typescript
import { prisma } from '@elyope/db';

// Example query
const users = await prisma.user.findMany();
```

## Models

Currently defined models:

- `User` - Basic user model with id, email, and name fields
