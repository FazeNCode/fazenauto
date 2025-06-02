#!/usr/bin/env node

/**
 * Admin Script to Create Authorized Users
 * 
 * Usage:
 * node scripts/create-user.js
 * 
 * This script helps you create authorized dealer accounts securely.
 * You need to set ADMIN_SECRET and AUTHORIZED_EMAILS in your environment.
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createUser() {
  console.log('\n🔐 Secure User Creation Script');
  console.log('=====================================\n');

  try {
    // Get environment variables
    const adminSecret = process.env.ADMIN_SECRET;
    const authorizedEmails = process.env.AUTHORIZED_EMAILS;

    if (!adminSecret) {
      console.error('❌ ADMIN_SECRET environment variable not set');
      process.exit(1);
    }

    if (!authorizedEmails) {
      console.error('❌ AUTHORIZED_EMAILS environment variable not set');
      console.log('💡 Set it like: AUTHORIZED_EMAILS="admin@example.com,dealer@example.com"');
      process.exit(1);
    }

    console.log('✅ Environment variables found');
    console.log(`📧 Authorized emails: ${authorizedEmails}\n`);

    // Get user input
    const email = await question('Enter email address: ');

    let password, confirmPassword;
    do {
      password = await question('Enter password (min 6 chars): ');
      if (password.length < 6) {
        console.log('❌ Password must be at least 6 characters long');
        continue;
      }

      confirmPassword = await question('Confirm password: ');
      if (password !== confirmPassword) {
        console.log('❌ Passwords do not match. Please try again.\n');
      }
    } while (password !== confirmPassword || password.length < 6);

    const role = await question('Enter role (dealer/admin) [dealer]: ') || 'dealer';

    console.log('\n🔄 Creating user...');

    // Make API request
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        role,
        adminSecret
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('\n✅ User created successfully!');
      console.log(`📧 Email: ${data.data.email}`);
      console.log(`👤 Role: ${data.data.role}`);
      console.log(`🆔 User ID: ${data.data.userId}`);
    } else {
      console.log('\n❌ Failed to create user:');
      console.log(`Error: ${data.error}`);
    }

  } catch (error) {
    console.error('\n❌ Script error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Next.js development server is running:');
      console.log('   npm run dev');
    }
  } finally {
    rl.close();
  }
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Script terminated by user');
  rl.close();
  process.exit(0);
});

// Run the script
createUser().catch(console.error);
