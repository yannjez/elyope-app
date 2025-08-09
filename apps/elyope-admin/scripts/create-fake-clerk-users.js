// Using node's built-in fetch (available since Node.js 18)
// const axios = require('axios');

// CONFIGURATION
const CLERK_API_KEY = 'sk_test_X0IAsusXTzywmx9r75vWis8uWOLHMVWeNxcOaLjQYB'; // <-- PUT your Clerk secret key here
const COUNT = 10; // <-- Number of users to create (replace 10 by {x})
const EMAIL_DOMAIN = 'example.com'; // Changed to a more standard domain

const CLERK_API_URL = 'https://api.clerk.com/v1/users';

async function createTestUser(index) {
  const timestamp = Date.now();
  const email = `testuser${timestamp}_${index}@${EMAIL_DOMAIN}`;
  const username = `testuser${timestamp}_${index}`;

  const body = {
    email_address: [email],
    first_name: 'Test',
    last_name: `User${index}`,
    username: username,
    password: `TestPassword${timestamp}_${index}!`, // Adding required password
  };

  try {
    const res = await fetch(CLERK_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLERK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error(`❌ HTTP ${res.status} for user ${email}:`);
      console.error(`Request body:`, JSON.stringify(body, null, 2));
      console.error(`Response:`, errorData);
      throw new Error(`HTTP error! status: ${res.status} - ${errorData}`);
    }

    const data = await res.json();
    console.log(`✅ Created: ${email} (id: ${data.id})`);
  } catch (err) {
    console.error(`❌ Error creating user ${email}:`, err.message);
  }
}

(async () => {
  console.log(`🚀 Starting to create ${COUNT} fake Clerk users...`);
  console.log(`📧 Using email domain: ${EMAIL_DOMAIN}`);
  console.log('---');

  for (let i = 0; i < COUNT; i++) {
    await createTestUser(i);
    // Add a small delay to avoid rate limiting
    if (i < COUNT - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log('---');
  console.log(`✨ Finished creating ${COUNT} fake users!`);
})();
