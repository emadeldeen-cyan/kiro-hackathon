# Troubleshooting Guide

## ❌ Problem: "Database connection failed: ECONNREFUSED"

**Error Message:**
```
Database connection failed: AggregateError
code: 'ECONNREFUSED'
Failed to connect to database. Please check your configuration.
```

**Solution:**

The server is trying to connect to PostgreSQL, but we're using an in-memory database.

### Fix 1: Use the .env file (Recommended)

Make sure you have a `.env` file in the `backend` directory with:

```bash
USE_IN_MEMORY=true
```

If the `.env` file doesn't exist:
```bash
cd backend
cp .env.example .env
```

The `.env` file should already be created with the correct settings.

### Fix 2: Set environment variable directly

```bash
USE_IN_MEMORY=true npm run dev
```

### Fix 3: Check your .env file

Open `backend/.env` and verify it contains:
```
USE_IN_MEMORY=true
```

If it says `USE_IN_MEMORY=false` or the line is commented out, change it to `true`.

---

## ❌ Problem: "Port already in use"

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

### Option 1: Kill the process using port 3000
```bash
# Find the process
lsof -i :3000

# Kill it (replace PID with the actual process ID)
kill -9 PID
```

### Option 2: Use a different port
Edit `.env`:
```
PORT=3001
```

---

## ❌ Problem: "Module not found" or TypeScript errors

**Solution:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## ❌ Problem: Tests failing

**Solution:**

```bash
# Run tests to see specific errors
npm test

# If tests pass but server fails, check:
# 1. .env file exists
# 2. USE_IN_MEMORY=true is set
# 3. No syntax errors in code
```

---

## ❌ Problem: CORS errors from frontend

**Error in browser console:**
```
Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:4200' 
has been blocked by CORS policy
```

**Solution:**

Add your frontend URL to `.env`:
```
FRONTEND_URL=http://localhost:4200,http://localhost:3000
```

Then restart the server.

---

## ❌ Problem: "401 Unauthorized" on API calls

**Solution:**

1. Make sure you're including the JWT token in the Authorization header:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

2. Check if your token has expired (24 hours by default)
   - Login again to get a new token

3. Verify the token is correct (no extra spaces or characters)

---

## ❌ Problem: Server starts but API doesn't respond

**Solution:**

1. Check if server is actually running:
   ```bash
   curl http://localhost:3000/health
   ```

2. Check the server logs for errors

3. Verify the port is correct (default: 3000)

4. Make sure you're using the correct base URL:
   ```
   http://localhost:3000/api
   ```

---

## ❌ Problem: "Cannot find module" when running dev

**Solution:**

```bash
# Install ts-node-dev
npm install --save-dev ts-node-dev

# Or use ts-node directly
npx ts-node src/index.ts
```

---

## ✅ Verify Everything is Working

Run this command to test all endpoints:

```bash
# 1. Check health
curl http://localhost:3000/health

# 2. Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test1234"}'

# If both work, your server is running correctly!
```

---

## 🔍 Debug Mode

To see more detailed logs, you can modify `src/index.ts` to add more console.log statements, or run with:

```bash
NODE_ENV=development npm run dev
```

---

## 📞 Still Having Issues?

1. Check that Node.js version is 18 or higher:
   ```bash
   node --version
   ```

2. Check that all dependencies are installed:
   ```bash
   npm list
   ```

3. Try a clean restart:
   ```bash
   # Stop the server (Ctrl+C)
   rm -rf node_modules dist
   npm install
   npm run dev
   ```

4. Check the server logs carefully - they usually indicate the exact problem

---

## 💡 Common Mistakes

1. **Forgetting to create .env file** - Copy from .env.example
2. **Wrong directory** - Make sure you're in the `backend` folder
3. **PostgreSQL not needed** - We use in-memory database by default
4. **Token in wrong format** - Should be `Bearer TOKEN`, not just `TOKEN`
5. **Data resets on restart** - This is expected with in-memory database
