# Authentication API Documentation

## Base URL

```
https://dgdorm-nodeend.vercel.app
```

## Endpoints

### 1. Register User

Register a new user and send verification OTP.

**Endpoint:** `POST /register`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "yourpassword",
  "phone": "1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": "123 Main St, New York, NY 10001",
  "profilePicture": "https://example.com/profile.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email with the OTP sent.",
  "data": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**

- 400 Bad Request: Invalid input data
- 409 Conflict: Email already exists
- 500 Internal Server Error: Server error

### 2. Verify OTP

Verify the OTP sent during registration.

**Endpoint:** `POST /verify-otp` or `GET /verify-otp`

**Request Body (POST):**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Query Parameters (GET):**

```
?email=user@example.com&otp=123456
```

**Response:**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Error Responses:**

- 400 Bad Request: Invalid OTP or email
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

### 3. Resend OTP

Request a new OTP for email verification.

**Endpoint:** `POST /resend-otp` or `GET /resend-otp`

**Request Body (POST):**

```json
{
  "email": "user@example.com"
}
```

**Query Parameters (GET):**

```
?email=user@example.com
```

**Response:**

```json
{
  "success": true,
  "message": "New OTP sent successfully",
  "data": {
    "email": "user@example.com",
    "expiresIn": "10 minutes"
  }
}
```

**Error Responses:**

- 400 Bad Request: Invalid email
- 404 Not Found: User not found
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server error

### 4. Login

Login with email and password.

**Endpoint:** `POST /login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "address": "123 Main St, New York, NY 10001",
    "profilePicture": "https://example.com/profile.jpg",
    "isVerified": true,
    "lastLogin": "2024-03-20T10:00:00Z"
  }
}
```

**Error Responses:**

- 400 Bad Request: Email and password are required
- 401 Unauthorized: Invalid password
- 403 Forbidden: Account not verified
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

### 5. Forgot Password

Request a password reset OTP.

**Endpoint:** `POST /forgot-password` or `GET /forgot-password`

**Request Body (POST):**

```json
{
  "email": "user@example.com"
}
```

**Query Parameters (GET):**

```
?email=user@example.com
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset OTP sent successfully",
  "data": {
    "email": "user@example.com",
    "expiresIn": "10 minutes"
  }
}
```

**Error Responses:**

- 400 Bad Request: Email is required
- 404 Not Found: User not found
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server error

### 6. Verify Reset OTP

Verify the OTP for password reset.

**Endpoint:** `POST /verify-reset-otp` or `GET /verify-reset-otp`

**Request Body (POST):**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Query Parameters (GET):**

```
?email=user@example.com&otp=123456
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "resetToken": "temporary_reset_token"
}
```

**Error Responses:**

- 400 Bad Request: Email and OTP are required
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

### 7. Reset Password

Reset password using the reset token.

**Endpoint:** `POST /reset-password`

**Request Body:**

```json
{
  "resetToken": "temporary_reset_token",
  "newPassword": "newpassword"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "new_jwt_token",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Error Responses:**

- 400 Bad Request: Reset token and new password are required
- 401 Unauthorized: Invalid reset token
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

### 8. Logout

Logout user (requires authentication).

**Endpoint:** `POST /logout`

**Headers:**

```
Authorization: Bearer your_jwt_token
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**

- 500 Internal Server Error: Server error

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error message (if any)"
}
```

Common HTTP Status Codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## Rate Limiting

- OTP requests are limited to 3 attempts
- OTP expires after 10 minutes
- Reset token expires after 15 minutes
- JWT token expires after 30 days

## Notes

1. All timestamps are in UTC
2. Passwords must be at least 6 characters long
3. Email addresses must be unique
4. OTP is a 6-digit number
5. JWT tokens expire after 30 days




////// home screen apis 


POST   /api/properties           // Create property
GET    /api/properties           // List/filter properties
GET    /api/properties/:id       // Property details
PUT    /api/properties/:id       // Update property
DELETE /api/properties/:id       // Delete property

POST   /api/bookings             // Create booking
GET    /api/bookings/user        // Get user's bookings
GET    /api/bookings/property/:id// Get bookings for a property
DELETE /api/bookings/:id         // Cancel booking

POST   /api/bookings/counter     // Make counter-offer
POST   /api/bookings/respond     // Owner responds to counter-offer

GET    /api/categories           // Get all categories

POST   /api/reviews              // Add review
GET    /api/reviews/:propertyId  // Get reviews for a property