# Search App

A React + TypeScript application demonstrating advanced search functionality with proper handling of concurrent requests and race conditions.

## 📋 Project Overview

This application was developed as a test assignment for a Senior Frontend Developer position. It implements a real-time search interface that addresses a critical challenge: ensuring data consistency when multiple asynchronous requests are in flight.

### Problem Solved

When users type quickly, multiple search requests are fired in rapid succession. Without proper handling, an older request might complete after a newer one, causing stale results to overwrite fresh data. This application demonstrates two strategies to prevent this:

1. **Just Abort Mode** - Cancels previous requests immediately when a new one is initiated
2. **Abort + Debounced Mode** - Combines request cancellation with debouncing to reduce request frequency

### Key Features

- ✅ Real-time search with instant feedback
- ✅ Request cancellation using AbortController
- ✅ Revision-based request tracking to prevent race conditions
- ✅ URL query parameters sync (`?q=search-term`)
- ✅ Configurable artificial delays for testing race conditions
- ✅ Two search modes (immediate vs. debounced)
- ✅ Mock backend with user data
- ✅ Zero state management libraries (pure React hooks)
- ✅ TypeScript throughout (backend + frontend)

## 🛠 Tech Stack

### Frontend
- **React** 18.2.0
- **TypeScript** 5.0.2
- **Webpack** 5.x (with webpack-dev-server)
- Minimal external dependencies (no Redux, MobX, etc.)

### Backend
- **Node.js** ^18
- **Express** 5.1.0
- **TypeScript** 5.0.2
- **Winston** (logging)
- **CORS** support

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "react": "18.2.0",
  "react-dom": "18.2.0"
}
```

### Backend Dependencies
```json
{
  "express": "5.1.0",
  "cors": "2.8.5",
  "compression": "^1.8.1",
  "morgan": "^1.10.1",
  "winston": "3.10.0"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js version 18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd search-app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

You need to run both the backend server and frontend development server.

#### 1. Start the Backend Server

In the `backend` directory:
```bash
npm start
```

This will:
- Build the TypeScript code
- Start the Express server on port **5010**
- Enable CORS for frontend requests

The backend API will be available at `http://localhost:5010`

#### 2. Start the Frontend Development Server

In a new terminal, navigate to the `frontend` directory:
```bash
npm start
```

This will:
- Start the webpack-dev-server
- Open the application in your browser (typically on port **3000**)
- Enable hot module replacement

The application will be available at `http://localhost:3000` (or the port shown in terminal)

## 🎯 How to Use

1. **Enter a search query** - Start typing in the search input field
2. **Switch modes** - Toggle between "Just Abort" and "Abort + Debounced" modes to see different behaviors
3. **Configure delays** - Add custom delay values (in milliseconds) to simulate slow network responses and observe race condition handling
4. **Select results** - Click on any search result to populate the input field

### Understanding Search Modes

- **Just Abort**: Every keystroke triggers a new request and cancels the previous one
- **Abort + Debounced**: Waits 400ms after the last keystroke before sending a request, cancelling any pending requests

### Testing Race Conditions

Try adding multiple delays (e.g., 2000, 500, 1500) and type quickly. Observe how:
- Older requests never overwrite newer results
- Each request uses the delay from a rotating pool
- The UI remains consistent regardless of request completion order

## 📁 Project Structure

```
search-app/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── main-thread.ts        # Server initialization
│   │   ├── setup-http-api.ts     # API routes
│   │   ├── types.ts              # TypeScript types
│   │   ├── logger.ts             # Winston logger
│   │   ├── mock.json             # Mock user data
│   │   └── middlewares/          # Express middlewares
│   ├── package.json
│   └── webpack.config.js
│
└── frontend/
    ├── src/
    │   ├── index.tsx             # Entry point
    │   ├── app.tsx               # Root component
    │   ├── api/                  # API layer with request handling
    │   ├── components/           # Reusable UI components
    │   ├── containers/           # Smart components
    │   └── hooks/                # Custom React hooks
    ├── package.json
    └── webpack.config.js
```

## 🔑 Key Implementation Details

### Request Cancellation
The application uses a dual-layer approach:
1. **Client-side**: AbortController + revision tracking
2. **Server-side**: Request signal monitoring with abort handling

### Data Consistency
```typescript
// Revision-based tracking ensures only the latest request updates state
const revision = ++lastRevision
if (lastRequest?.revision !== revision) {
  throw new OutdatedError()
}
```

### URL Synchronization
Search queries are automatically synced with URL query parameters using a custom `useQueryParams` hook, enabling:
- Bookmarkable search results
- Browser back/forward navigation
- Direct URL sharing

## 📝 Building for Production

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

Built files will be in:
- Backend: `backend/server/`
- Frontend: `frontend/dist/`

## 🧪 Code Quality

Both projects include linting and formatting:

```bash
# Lint code
npm run lint

# Format code
npm run prettier
```

## 📄 License

MIT

## 👤 Author

pbelinovich

---

**Note**: This is a test assignment demonstrating proficiency in React, TypeScript, and handling complex asynchronous scenarios without relying on heavy state management libraries.

---

Made with ❤️ for React and crafted with care.
