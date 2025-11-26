# 🚨 Quick Fix: Database Connection Error

## Problem
```
Database connection failed: ECONNREFUSED
Failed to connect to database. Please check your configuration.
```

## ✅ Solution (30 seconds)

### Step 1: Check if .env file exists
```bash
cd backend
ls -la .env
```

If it doesn't exist:
```bash
cp .env.example .env
```

### Step 2: Verify .env contains this line
```bash
cat .env | grep USE_IN_MEMORY
```

Should show:
```
USE_IN_MEMORY=true
```

If not, add it:
```bash
echo "USE_IN_MEMORY=true" >> .env
```

### Step 3: Start the server
```bash
npm run dev
```

## ✅ Expected Output

You should see:
```
[INFO] ts-node-dev ver. 2.0.0
Using in-memory database (no PostgreSQL connection required)
Skipping database initialization (using in-memory storage)
Server is running on port 3000
Environment: development
```

## 🧪 Test It Works

In another terminal:
```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

## 🎉 Success!

Your server is now running with an in-memory database. No PostgreSQL needed!

---

## Alternative: One-Line Fix

```bash
cd backend && echo "USE_IN_MEMORY=true" > .env && npm run dev
```

---

## Still Not Working?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more solutions.
