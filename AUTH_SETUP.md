# Authentication Setup Guide

This guide explains how to set up the authentication system for the Baegum website.

## 1. Environment Variables Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### Required Environment Variables

#### `VITE_API_URL`
- **Purpose**: Base URL for your backend API
- **Default**: `http://localhost:3001`
- **Example**: `http://localhost:3001` or `https://api.yourdomain.com`

#### `VITE_GOOGLE_CLIENT_ID`
- **Purpose**: Google OAuth 2.0 Client ID for "Sign in with Google"
- **How to get it**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing one
  3. Enable "Google+ API"
  4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
  5. Select "Web application"
  6. Add authorized JavaScript origins:
     - For development: `http://localhost:5173`
     - For production: `https://yourdomain.com`
  7. Copy the generated Client ID
  8. Add it to `.env.local` as `VITE_GOOGLE_CLIENT_ID=your-client-id`

#### `VITE_API_TIMEOUT`
- **Purpose**: Request timeout in milliseconds
- **Default**: `10000` (10 seconds)

## 2. API Endpoints Required

Your backend API should implement these endpoints:

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "token": "jwt-token-here",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe"
      }
    }
  }
  ```

### Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Same as login response

### Google OAuth Login
- **Endpoint**: `POST /api/auth/google`
- **Request**:
  ```json
  {
    "token": "google-id-token-here"
  }
  ```
- **Response**: Same as login response

### Forgot Password
- **Endpoint**: `POST /api/auth/forget-password`
- **Request**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Reset link sent to email"
  }
  ```

## 3. Frontend Integration

The authentication system is already integrated. Here's how it works:

### Login Flow
1. User clicks "Login" → AuthModal opens
2. Enters email and password
3. Click "Login" button
4. API call to `/api/auth/login`
5. Token stored in localStorage
6. User state updated in AuthContext
7. Modal closes and user is logged in

### Sign Up Flow
1. User clicks "Sign Up" → AuthModal opens
2. Enters email, password, and confirms password
3. Click "Sign up" button
4. API call to `/api/auth/signup`
5. User automatically logged in
6. Token stored in localStorage

### Google Sign-In Flow
1. User clicks "Google" button
2. Google Sign-In popup opens
3. User approves login
4. Google ID token sent to backend
5. API call to `/api/auth/google`
6. Token stored and user logged in

## 4. Protected Routes

Protected actions that require login:
- Add to Cart
- Buy Now
- Submit Review

If user is not logged in, clicking these will open the login modal.

## 5. Token Management

- Token is stored in `localStorage` with key `authToken`
- Token is automatically included in all API requests via `Authorization: Bearer <token>` header
- Token is cleared when user logs out
- Session persists across page refreshes

## 6. Logout

To logout, the frontend clears:
- `authToken` from localStorage
- User data from state
- Updates `isLoggedIn` to false

## 7. Troubleshooting

### Google Sign-In not working
- Verify `VITE_GOOGLE_CLIENT_ID` is set correctly
- Check that your domain is in authorized JavaScript origins
- Check browser console for errors
- Ensure `https://accounts.google.com/gsi/client` script is loaded

### API calls failing
- Verify `VITE_API_URL` is correct
- Check if backend is running
- Verify CORS is configured on backend
- Check network tab in browser DevTools

### Token not persisting
- Check if localStorage is enabled in browser
- Verify token is being returned from backend
- Check if auth header is being set correctly

## 8. Files Modified for Auth

- `src/context/AuthContext.jsx` - Authentication state and functions
- `src/services/auth.js` - Authentication API calls
- `src/services/api.js` - API service with auth token injection
- `src/components/Auth/AuthModal.jsx` - Login/Signup UI
- `src/pages/Product/ClothingProductPage.jsx` - Protected actions
- `src/pages/Product/StandardProductPage.jsx` - Protected actions
- `src/pages/Product/components/ReviewSection.jsx` - Protected review submission
- `index.html` - Google Sign-In script
- `.env.example` - Environment variables template
