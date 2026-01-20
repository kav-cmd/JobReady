# MongoDB Installation Instructions

## Option 1: Update Command Line Tools (Required for Local MongoDB)

Your Command Line Tools need to be updated. Please follow these steps:

1. **Open System Settings** (or System Preferences)
2. Go to **Software Update**
3. Look for **Command Line Tools for Xcode** updates
4. Install any available updates

**OR** run this command in Terminal (you'll need to enter your password):
```bash
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --install
```

After updating, run:
```bash
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

## Option 2: Use MongoDB Atlas (Cloud - Recommended, No Installation Needed)

This is the easiest option and doesn't require any local installation:

1. **Sign up for free MongoDB Atlas account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account (no credit card required)

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Set up database access:**
   - Go to "Database Access" → "Add New Database User"
   - Create a username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"

4. **Get connection string:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

5. **Update your `.env` file:**
   ```bash
   cd backend
   # Edit .env file and update MONGODB_URI:
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/vocational?retryWrites=true&w=majority
   ```

6. **Restart your backend:**
   ```bash
   npm run dev
   ```

## Verify MongoDB Connection

After setup, test the connection:
```bash
# For local MongoDB:
mongosh --eval "db.adminCommand('ping')"

# For Atlas: Check backend logs when starting the server
```

## Which Option Should You Choose?

- **MongoDB Atlas (Cloud)**: ✅ Easier, no installation, works immediately, free tier available
- **Local MongoDB**: Requires updating Command Line Tools first, but gives you full control

**Recommendation**: Use MongoDB Atlas for now - it's faster to set up and works immediately!
