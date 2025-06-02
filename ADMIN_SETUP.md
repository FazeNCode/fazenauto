# 🔐 Secure Admin Setup Guide

This guide explains how to set up secure dealer authentication for your FazeNAuto admin dashboard.

## 🛡️ Security Model

- **No Public Registration**: Users cannot register themselves
- **Authorized Emails Only**: Only pre-approved emails can access the system
- **Admin-Controlled**: You control who gets access
- **Secure Creation**: Users are created through secure admin tools

## 📋 Setup Steps

### 1. Set Environment Variables

Add these to your AWS Amplify environment variables:

```bash
# Required for secure user creation
ADMIN_SECRET=TestSeceret123
AUTHORIZED_EMAILS=admin@fazenauto.com
```

### 2. Create Admin Users

**Web Interface (Primary Method):**
1. Go to: `/admin-create-user` (React page) or `/admin-create-user.html` (static page)
2. Enter your `ADMIN_SECRET`: `TestSeceret123`
3. Enter email (must be in `AUTHORIZED_EMAILS`)
4. Set password and role (admin/dealer)
5. Click "Create User"

## 🔑 How It Works

### Login Process
1. User goes to `/login`
2. Enters email and password
3. System checks:
   - ✅ Email is in `AUTHORIZED_EMAILS` list
   - ✅ User account exists in database
   - ✅ Password is correct
4. If all checks pass, user gets access to `/admin`

### Security Features
- **Email Whitelist**: Only authorized emails can even attempt login
- **Account Required**: Email must exist in database (created by admin)
- **Password Protection**: Bcrypt hashed passwords
- **Admin Secret**: User creation requires secret key

## 👥 Managing Users

### Adding New Authorized Emails
1. Update `AUTHORIZED_EMAILS` in AWS Amplify environment variables
2. Redeploy your application
3. Create user account using the web interface

### Removing Access
1. Remove email from `AUTHORIZED_EMAILS` (prevents new logins)
2. Optionally delete user from database

### Changing Passwords
Users will need to contact you to reset passwords. You can:
1. Delete their account
2. Create a new account with new password

## 🚨 Security Best Practices

- **Never commit secrets to code**
- **Use strong, unique `ADMIN_SECRET`**
- **Keep `AUTHORIZED_EMAILS` up to date**
- **Only add trusted emails to authorized list**
- **Use strong passwords for all accounts**
- **Remove access for former employees immediately**

## 🔧 Troubleshooting

### "Access denied. Email not authorized"
- Check that email is in `AUTHORIZED_EMAILS`
- Verify environment variable is set correctly
- Redeploy after changing environment variables

### "Account not found"
- Email is authorized but no user account exists
- Create user account using the web interface

### "Invalid admin secret"
- Check `ADMIN_SECRET` environment variable
- Ensure you're using the correct secret: `TestSeceret123`

### "User already exists"
- Account already created for this email
- User can login with existing credentials

## 🔄 Current Setup

**Environment Variables:**
```bash
ADMIN_SECRET=TestSeceret123
AUTHORIZED_EMAILS=admin@fazenauto.com
```

**User Creation:** Use `/admin-create-user` web interface
**Login:** Users go to `/login` then access `/admin` dashboard

This setup ensures only you control who can access your admin dashboard! 🔒
