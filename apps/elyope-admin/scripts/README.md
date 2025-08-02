# Scripts

This directory contains utility scripts for the elyope-admin application.

## create-fake-clerk-users.js

This script creates fake users in your Clerk application for testing purposes.

### Setup

1. **Install dependencies** (if not already installed):
   ```bash
   pnpm install
   ```

2. **Configure the script**:
   - Open `scripts/create-fake-clerk-users.js`
   - Replace `'sk_test_xxx'` with your actual Clerk secret key
   - Adjust the `COUNT` variable to specify how many users to create
   - Optionally change the `EMAIL_DOMAIN` to use a different domain

### Usage

Run the script using npm/pnpm:

```bash
# Using pnpm (recommended)
pnpm create-fake-users

# Or using npm
npm run create-fake-users
```

### Configuration Options

- `CLERK_API_KEY`: Your Clerk secret key (required)
- `COUNT`: Number of users to create (default: 10)
- `EMAIL_DOMAIN`: Domain for fake email addresses (default: 'test-users.fake')

### Example Output

```
🚀 Starting to create 10 fake Clerk users...
📧 Using email domain: test-users.fake
---
✅ Created: testuser1703123456789_0@test-users.fake (id: user_2abc123def456)
✅ Created: testuser1703123456890_1@test-users.fake (id: user_2abc123def789)
...
---
✨ Finished creating 10 fake users!
```

### Notes

- The script includes a 100ms delay between user creation requests to avoid rate limiting
- Each user gets a unique email and username based on the current timestamp
- Failed user creations will be logged but won't stop the script
- Make sure you have the necessary permissions in your Clerk application 