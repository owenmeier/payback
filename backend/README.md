# PayBack Backend API

Backend API for PayBack - AI-powered receipt splitting application.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and add your API keys

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### Production
```bash
# Build
npm run build

# Start
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── index.ts         # Entry point
├── uploads/             # Temporary file storage (gitignored)
├── dist/                # Compiled output (gitignored)
└── package.json
```

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```
Returns API status.

### Upload Receipt
```
POST /api/upload
Content-Type: multipart/form-data

Body: { receipt: <file> }
```
Uploads receipt image and creates session.

### Parse Receipt (Coming Soon)
```
POST /api/parse
Body: { sessionId, imageUrl }
```
Parses receipt using GPT-4o.

### Get Session (Coming Soon)
```
GET /api/session/:sessionId
```
Retrieves session data.

## 🔧 Environment Variables

Required variables (see `.env.example`):

```bash
NODE_ENV=development           # Environment (development/production)
PORT=5000                      # Server port
OPENAI_API_KEY=                # OpenAI API key (for GPT-4o)
SESSION_SECRET=                # Session encryption secret
FRONTEND_URL=                  # Frontend URL (for CORS)
MAX_FILE_SIZE=10485760        # Max upload size (10MB)
UPLOAD_DIR=uploads/temp       # Upload directory
RATE_LIMIT_WINDOW_MS=3600000  # Rate limit window (1 hour)
RATE_LIMIT_MAX_REQUESTS=10    # Max requests per window
```

## 🔐 Security Features

- ✅ CORS configured for frontend only
- ✅ Rate limiting (10 requests/hour)
- ✅ File validation (type, size)
- ✅ Session encryption
- ✅ Input sanitization
- ✅ HTTPS in production

## 📦 Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 5
- **Language:** TypeScript
- **AI:** OpenAI GPT-4o (Vision)
- **File Upload:** Multer
- **Session:** express-session

## 🚢 Deployment

### Railway (Recommended)
1. Connect GitHub repository
2. Set root directory to `/backend`
3. Add environment variables
4. Deploy automatically

See `DEPLOYMENT_CHECKLIST.md` for detailed guide.

### Render
Free tier alternative with cold starts.

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Lint code
npm run lint
```

## 📝 Development Notes

### Current Status
- ✅ Server setup
- ✅ File upload endpoint
- ✅ Session management
- ✅ Error handling
- ✅ Rate limiting
- ⏳ GPT-4o integration (Phase 1C)
- ⏳ Calculation service (Phase 1B)

### Mock API Mode
During development, the frontend uses mock data to avoid API costs. Real backend integration is ready when needed.

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Build Errors
```bash
# Clean and rebuild
rm -rf dist
npm run build
```

### TypeScript Errors
```bash
# Check tsconfig.json
# Ensure all types are installed
npm install
```

## 📚 Resources

- [Express Documentation](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [OpenAI API Docs](https://platform.openai.com/docs)

## 📄 License

MIT
