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
ADMIN_SECRET=your-super-secret-admin-key-here
AUTHORIZED_EMAILS=admin@fazenauto.com,dealer1@fazenauto.com,dealer2@fazenauto.com
```

**Important:**
- `ADMIN_SECRET`: TestSeceret123
- `AUTHORIZED_EMAILS`: admin@fazenauto.com

### 2. Create Your First Admin User

You have 3 options to create users:

#### Option A: Web Interface (Recommended)
1. Go to: `https://your-site.com/admin-create-user.html`
2. Enter your `ADMIN_SECRET`
3. Enter email (must be in `AUTHORIZED_EMAILS`)
4. Set password and role
5. Click "Create User"

#### Option B: Node.js Script
```bash
# Make sure your dev server is running
npm run dev

# In another terminal, run:
ADMIN_SECRET=your-secret AUTHORIZED_EMAILS=admin@fazenauto.com node scripts/create-user.js
```

#### Option C: Direct API Call
```bash
curl -X POST https://your-site.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fazenauto.com",
    "password": "secure-password",
    "role": "admin",
    "adminSecret": "your-super-secret-admin-key-here"
  }'
```

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
1. Update `AUTHORIZED_EMAILS` in AWS Amplify
2. Redeploy your application
3. Create user account using one of the methods above

### Removing Access
1. Remove email from `AUTHORIZED_EMAILS` (prevents new logins)
2. Optionally delete user from database

### Changing Passwords
Users will need to contact you to reset passwords. You can:
1. Delete their account
2. Create a new account with new password

## 🚨 Security Best Practices

### Environment Variables
- **Never commit secrets to code**
- **Use strong, unique `ADMIN_SECRET`**
- **Regularly rotate secrets**
- **Keep `AUTHORIZED_EMAILS` up to date**

### Access Control
- **Only add trusted emails to authorized list**
- **Use strong passwords for all accounts**
- **Regularly review who has access**
- **Remove access for former employees immediately**

### Monitoring
- **Check login logs regularly**
- **Monitor for failed login attempts**
- **Review user activity in admin dashboard**

## 🔧 Troubleshooting

### "Access denied. Email not authorized"
- Check that email is in `AUTHORIZED_EMAILS`
- Verify environment variable is set correctly
- Redeploy after changing environment variables

### "Account not found"
- Email is authorized but no user account exists
- Create user account using admin tools

### "Invalid admin secret"
- Check `ADMIN_SECRET` environment variable
- Ensure you're using the correct secret when creating users

### "User already exists"
- Account already created for this email
- User can login with existing credentials

## 📞 Support

If you need help:
1. Check this guide first
2. Verify all environment variables are set
3. Test with the web interface at `/admin-create-user.html`
4. Check browser console for errors

## 🔄 Example Workflow

1. **Initial Setup:**
   ```bash
   ADMIN_SECRET=mySecretKey123
   AUTHORIZED_EMAILS=owner@fazenauto.com,manager@fazenauto.com
   ```

2. **Create Owner Account:**
   - Go to `/admin-create-user.html`
   - Email: `owner@fazenauto.com`
   - Role: `admin`

3. **Create Manager Account:**
   - Email: `manager@fazenauto.com`
   - Role: `dealer`

4. **Users Can Login:**
   - Go to `/login`
   - Enter credentials
   - Access `/admin` dashboard

This setup ensures only you control who can access your admin dashboard! 🔒
