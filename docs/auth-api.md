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
  "address": "string",
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
    "address": "123 Main St",
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
