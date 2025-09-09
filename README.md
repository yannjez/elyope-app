# Elyope APP

A comprehensive veterinary management application built with NX monorepo architecture.

## Description

Elyope is a modern veterinary application that provides comprehensive tools for managing veterinary practices, including patient records, examinations, and administrative tasks. Built with Next.js, TypeScript, and Tailwind CSS in an NX monorepo structure.

## Apps

### Veterinarian App

The main veterinary management application providing the core functionality for veterinary practices.

**Features:**

- Patient management
- Examination tracking
- Appointment scheduling
- Administrative dashboard

**Commands:**

```bash
# Start development server
npx nx dev veterinarian

# Build for production
npx nx build veterinarian

# Run tests
npx nx test veterinarian

# Lint code
npx nx lint veterinarian
```

## Libraries

### Shared Components

A comprehensive component library providing reusable UI components across the application.

**Features:**

- Form components (Button, Input, Select)
- Navigation components (MenuCard, Sidemenu)
- Data display components (DataGrid, ListFilter)
- Icon library
- Common utilities

**Commands:**

```bash
# Build shared components
npx nx build shared-components

# Test shared components
npx nx test shared-components

# Lint shared components
npx nx lint shared-components

# Lint shared components
npx nx lint all
```

### Database Library

Database management and Prisma schema configuration for the application.

**Features:**

- Prisma ORM integration
- Database schema management
- Database utilities and helpers

**Commands:**

```bash
# Generate Prisma client
npx nx run db:generate

# Run database migrations
npx nx run db:migrate --name xxxx

# Reset database
npx nx run db:migrate-reset

# Build database library
npx nx build db

# Push model to database l
npx nx run db:db-push

#check lint
npx nx run-many --target=lint  --all

#check lint
npx nx run-many --target=typechek  --all
```

### Theme

Base theme configuration and styling system.

**Features:**

- Global CSS variables
- Tailwind CSS configuration
- Design system foundation

**Location:** `lib/theme/theme.css`

**Usage:**
The theme file serves as the base styling foundation for the entire application, providing consistent design tokens and CSS custom properties.

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- NX CLI

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
npx nx serve veterinarian

# Run all tests
npx nx run-many --target=test --all

# Run all lint
npx nx run-many --target=lint --all

# Run all typecheck
npx nx run-many --target=typecheck --all


# Build all projects
npx nx run-many --target=build --all
```

### Project Structure

```
app-test2/
├── apps/
│   └── veterinarian/          # Main veterinary application
├── lib/
│   ├── db/                   # Database management
│   ├── shared-components/    # Reusable UI components
│   └── theme/               # Base theme configuration
└── packages/                # Additional packages
```

## Useful Commands

```bash
# View project graph
npx nx graph

# Run affected commands
npx nx affected:build

# Check TypeScript project references
npx nx sync:check

# Generate new components
npx nx g @nx/react:component --project=shared-components

npx nx g @nx/next:app apps/{appName}
```
