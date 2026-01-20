# MongoDB Setup Guide

## Issue
The "Failed to create account" error occurs because MongoDB is not running. The backend needs MongoDB to store user accounts.

## Quick Fix - Install and Start MongoDB

### Option 1: Install MongoDB using Homebrew (Recommended for macOS)

```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

### Option 2: Use MongoDB Atlas (Cloud - Free)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vocational
   ```

### Option 3: Install MongoDB manually

Download from: https://www.mongodb.com/try/download/community

## Verify MongoDB is Running

After installation, verify MongoDB is running:

```bash
# Check if MongoDB is running
brew services list | grep mongo

# Or test connection
mongosh --eval "db.adminCommand('ping')"
```

## Restart Backend

After MongoDB is running, restart your backend:

```bash
cd backend
npm run dev
```

## Troubleshooting

- **Port 27017 in use**: MongoDB uses port 27017. Make sure nothing else is using it.
- **Permission errors**: Make sure you have write permissions for the MongoDB data directory.
- **Connection refused**: MongoDB service might not be started. Run `brew services start mongodb-community@7.0`
