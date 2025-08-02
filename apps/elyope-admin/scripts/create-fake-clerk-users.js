const axios = require('axios');

// CONFIGURATION
const CLERK_API_KEY = 'sk_test_xxx'; // <-- PUT your Clerk secret key here
const COUNT = 10; // <-- Number of users to create (replace 10 by {x})
const EMAIL_DOMAIN = 'test-users.fake'; // Or any non-existing/controlled domain

const CLERK_API_URL = 'https://api.clerk.com/v1/users';

async function createTestUser(index) {
  const email = `testuser${Date.now()}_${index}@${EMAIL_DOMAIN}`;
  const body = {
    email_address: [email],
    first_name: 'Test',
    last_name: `User${index}`,
    username: `testuser${Date.now()}_${index}`,
  };

  try {
    const res = await axios.post(CLERK_API_URL, body, {
      headers: {
        Authorization: `Bearer ${CLERK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`✅ Created: ${email} (id: ${res.data.id})`);
  } catch (err) {
    console.error(
      `❌ Error creating user ${email}:`,
      err.response?.data || err.message
    );
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
