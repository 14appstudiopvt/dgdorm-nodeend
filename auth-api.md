# Authentication API Documentation

## Overview

This document provides detailed information about the authentication API endpoints, including request/response formats, error handling, and important notes.

## Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`  
**Description:** Register a new user with email verification

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "dateOfBirth": "date",
  "gender": "string",
  "address": "string",
  "profilePicture": "string (URL)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with the OTP sent.",
  "data": {
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  }
}
```

**Error Responses:**

- 400: User already exists
- 500: Registration failed

### 2. Verify OTP

**Endpoint:** `POST /api/auth/verify-otp`  
**Description:** Verify user's email using OTP

**Request Body or Query Parameters:**

```json
{
  "email": "string",
  "otp": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "isVerified": true
  }
}
```

**Error Responses:**

- 400: Email and OTP are required
- 400: No OTP found
- 400: OTP has expired
- 400: Maximum OTP attempts reached
- 400: Invalid OTP (includes attemptsLeft)
- 404: User not found
- 500: OTP verification failed

### 3. Resend OTP

**Endpoint:** `POST /api/auth/resend-otp`  
**Description:** Request a new OTP for email verification

**Request Body or Query Parameters:**

```json
{
  "email": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "New OTP sent successfully",
  "data": {
    "email": "string",
    "expiresIn": "10 minutes"
  }
}
```

**Error Responses:**

- 400: Email is required
- 404: User not found
- 500: Failed to resend OTP

### 4. Login

**Endpoint:** `POST /api/auth/login`  
**Description:** Authenticate user and get access token

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "string (JWT)",
  "user": {
    // User object without password
  }
}
```

**Error Responses:**

- 400: Email and password are required
- 401: Invalid password
- 403: Please verify your email first
- 404: User not found
- 500: Login failed

### 5. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`  
**Description:** Request password reset OTP

**Request Body or Query Parameters:**

```json
{
  "email": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password reset OTP sent successfully",
  "data": {
    "email": "string",
    "expiresIn": "10 minutes"
  }
}
```

**Error Responses:**

- 400: Email is required
- 404: User not found
- 500: Failed to send password reset OTP

### 6. Verify Reset OTP

**Endpoint:** `POST /api/auth/verify-reset-otp`  
**Description:** Verify OTP for password reset

**Request Body or Query Parameters:**

```json
{
  "email": "string",
  "otp": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "resetToken": "string (JWT)"
}
```

**Error Responses:**

- 400: Email and OTP are required
- 400: No OTP found
- 400: OTP has expired
- 400: Maximum OTP attempts reached
- 400: Invalid OTP
- 404: User not found
- 500: OTP verification failed

### 7. Reset Password

**Endpoint:** `POST /api/auth/reset-password`  
**Description:** Reset password using reset token

**Request Body:**

```json
{
  "resetToken": "string",
  "newPassword": "string"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "isVerified": true
  }
}
```

**Error Responses:**

- 400: Reset token and new password are required
- 400: Invalid reset token
- 404: User not found
- 500: Password reset failed

### 8. Logout

**Endpoint:** `POST /api/auth/logout`  
**Description:** Logout user (client-side token removal)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Response (500):**

```json
{
  "success": false,
  "message": "Logout failed",
  "error": "Detailed error message"
}
```

## Common Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message (if available)"
}
```

## Important Notes

1. All JWT tokens expire in 30 days except reset tokens which expire in 15 minutes
2. OTPs expire in 10 minutes
3. Maximum 3 OTP verification attempts allowed
4. All endpoints return appropriate HTTP status codes
5. Password is never returned in any response
6. Email verification is required before login
7. All timestamps are in ISO format
8. Some endpoints accept parameters via both query string and request body

## Security Considerations

- All sensitive data is transmitted over HTTPS
- Passwords are hashed before storage
- JWT tokens are used for authentication
- OTP verification adds an extra layer of security
- Rate limiting is implemented for OTP requests
- Session management is handled through JWT tokens
- Default JWT secret is used if environment variable is not set
