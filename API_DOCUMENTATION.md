# DG Dorm API Documentation

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Testing Guide](#testing-guide)
- [Security Notes](#security-notes)

## Overview

This documentation provides detailed information about the DG Dorm API endpoints, request/response formats, and testing procedures. The API follows RESTful principles and uses JWT for authentication.

## Base URL

```
https://dgdorm-nodeend.vercel.app
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. User Registration

Register a new user in the system.

```http
POST /api/auth/register
```

#### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "profilePicture": "https://example.com/profile.jpg" // optional
}
```

#### Response

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with the OTP sent.",
  "data": {
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 2. Email Verification

Verify user's email using OTP.

```http
POST /api/auth/verify-otp
```

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

#### Response

```json
{
  "success": true,
  "message": "Email verified successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isVerified": true
  }
}
```

### 3. Resend OTP

Request a new OTP for email verification.

```http
POST /api/auth/resend-otp
```

#### Request Body

```json
{
  "email": "john.doe@example.com"
}
```

#### Response

```json
{
  "success": true,
  "message": "New OTP sent successfully",
  "data": {
    "email": "john.doe@example.com",
    "expiresIn": "10 minutes"
  }
}
```

### 4. User Login

Authenticate user and get access token.

```http
POST /api/auth/login
```

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isVerified": true
  }
}
```

### 5. Forgot Password

Initiate password reset process.

```http
POST /api/auth/forgot-password
```

#### Request Body

```json
{
  "email": "john.doe@example.com"
}
```

#### Response

```json
{
  "success": true,
  "message": "Password reset OTP sent successfully",
  "data": {
    "email": "john.doe@example.com",
    "expiresIn": "10 minutes"
  }
}
```

### 6. Verify Reset OTP

Verify OTP for password reset.

```http
POST /api/auth/verify-reset-otp
```

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

#### Response

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "resetToken": "reset_token_here"
}
```

### 7. Reset Password

Set new password after OTP verification.

```http
POST /api/auth/reset-password
```

#### Request Body

```json
{
  "resetToken": "reset_token_here",
  "newPassword": "newsecurepassword123"
}
```

#### Response

```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "isVerified": true
  }
}
```

### 8. Logout

Invalidate user session.

```http
POST /api/auth/logout
```

#### Headers

```
Authorization: Bearer jwt_token_here
```

#### Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Handling

### Common Error Responses

1. **400 Bad Request**

```json
{
  "success": false,
  "message": "Error message here"
}
```

2. **401 Unauthorized**

```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

3. **404 Not Found**

```json
{
  "success": false,
  "message": "Resource not found"
}
```

4. **500 Server Error**

```json
{
  "success": false,
  "message": "Something went wrong!",
  "error": "Error details"
}
```

## Testing Guide

### Using Postman

1. **Setup**

   - Import the API collection into Postman
   - Set the base URL as `https://dgdorm-nodeend.vercel.app`
   - Create an environment variable for the JWT token

2. **Testing Flow**
   - Start with registration
   - Verify email with OTP
   - Login to get JWT token
   - Use token for authenticated requests
   - Test password reset flow
   - Test logout

### Using cURL

Example registration request:

```bash
curl -X POST https://dgdorm-nodeend.vercel.app/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}'
```

## Security Notes

1. **Password Requirements**

   - Minimum 8 characters
   - Should include numbers and special characters
   - Stored securely using bcrypt hashing

2. **Token Security**

   - JWT tokens expire after 30 days
   - Tokens should be stored securely
   - Never expose tokens in client-side code

3. **OTP Security**

   - OTP expires after 10 minutes
   - Maximum 3 verification attempts
   - New OTP invalidates previous ones

4. **Rate Limiting**

   - API endpoints are rate-limited
   - Excessive requests may be blocked

5. **Data Validation**
   - All input is validated
   - Email format is verified
   - Phone numbers must be 10 digits

## Best Practices

1. **Error Handling**

   - Always check response status
   - Handle network errors gracefully
   - Implement proper error messages

2. **Security**

   - Use HTTPS for all requests
   - Store tokens securely
   - Implement proper logout

3. **Testing**
   - Test all error scenarios
   - Verify email flow
   - Test password reset flow
   - Check token expiration

## Support

For API support or issues, please contact:

- Email: support@dgdorm.com
- Documentation: https://dgdorm-nodeend.vercel.app/docs
