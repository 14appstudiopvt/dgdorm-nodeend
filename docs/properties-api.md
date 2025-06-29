# Properties API Documentation

This document describes the API endpoints for managing and retrieving property data, suitable for powering a home screen with a map and category-based filtering.

---

## Endpoint Summary

### Public Property Routes

| Method | Endpoint               | Access | Description                                   |
| ------ | ---------------------- | ------ | --------------------------------------------- |
| GET    | /api/properties        | Public | Get all approved properties (with pagination) |
| GET    | /api/properties/:id    | Public | Get a single approved property by ID          |
| POST   | /api/properties/filter | Public | Filter/search properties by criteria          |

### User Favorite Routes

| Method | Endpoint                 | Access  | Description                        |
| ------ | ------------------------ | ------- | ---------------------------------- |
| POST   | /api/users/:id/favorites | Private | Add a property to user's favorites |
| GET    | /api/users/:id/favorites | Private | Get user's favorite properties     |

### Owner Property Routes

| Method | Endpoint                  | Access | Description                                |
| ------ | ------------------------- | ------ | ------------------------------------------ |
| GET    | /api/owner/properties     | Owner  | Get all properties for the logged-in owner |
| POST   | /api/properties           | Owner  | Create a new property                      |
| PUT    | /api/owner/properties/:id | Owner  | Update a property owned by the owner       |
| DELETE | /api/owner/properties/:id | Owner  | Delete a property owned by the owner       |

### Admin Moderation Routes

| Method | Endpoint                          | Access | Description                               |
| ------ | --------------------------------- | ------ | ----------------------------------------- |
| GET    | /api/admin/properties             | Admin  | Get properties by status (e.g., pending)  |
| POST   | /api/admin/properties/:id/approve | Admin  | Approve a property                        |
| POST   | /api/admin/properties/:id/reject  | Admin  | Reject a property                         |
| POST   | /api/admin/owners/:id/ban         | Admin  | Ban an owner and disable their properties |

### Extra Admin APIs

| Method | Endpoint                  | Access | Description                           |
| ------ | ------------------------- | ------ | ------------------------------------- |
| GET    | /api/admin/users          | Admin  | Get all users                         |
| GET    | /api/admin/owners         | Admin  | Get all owners                        |
| GET    | /api/admin/all-properties | Admin  | Get all properties (no status filter) |

---

## Authentication & Headers

- **Public**: No authentication required.
- **Private/Owner/Admin**: Requires JWT in the `Authorization` header:
  - `Authorization: Bearer <token>`

---

## Detailed Endpoint Descriptions

(See above in this file for request/response examples for each main endpoint. If you need a detailed example for any specific endpoint, let me know!)

---

## 1. Get All Categories

- **Endpoint:** `GET /api/categories`
- **Description:** Retrieve all property categories (e.g., Apartment, Hostel, PG, etc.).
- **Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f67890a1b2c3",
      "name": "Apartment",
      "description": "Nice apartments",
      "icon": "https://.../icon1.png",
      "createdBy": {
        "_id": "64f1a2b3c4d5e6f7890a1b2c",
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com",
        "role": "admin"
      }
    }
  ]
}
```

---

## 2. Get All Properties

- **Endpoint:** `GET /api/properties`
- **Description:** Retrieve all approved properties with optional pagination.
- **Query Params:**
  - `page`: Page number (optional, default: 1)
  - `limit`: Number of items per page (optional, default: 10)
- **Response Example:**

```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "total": 2,
    "page": 1,
    "pages": 1
  },
  "data": [
    {
      "_id": "abc123",
      "title": "Cozy Apartment",
      "description": "A beautiful apartment in the city center...",
      "category": { "_id": "65a1b2c3d4e5f67890a1b2c3", "name": "Apartment" },
      "owner": {
        "_id": "user1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "location": { "type": "Point", "coordinates": [77.5946, 12.9716] },
      "address": "123 Main St",
      "price": 1200,
      "images": ["https://.../img1.jpg", "https://.../img2.jpg"],
      "amenities": ["WiFi", "Parking"],
      "status": "approved",
      "isAvailable": true,
      "createdAt": "2024-06-01T12:00:00.000Z",
      "updatedAt": "2024-06-01T12:00:00.000Z"
    }
  ]
}
```

---

## 3. Get Property Details

- **Endpoint:** `GET /api/properties/:id`
- **Description:** Retrieve detailed information about a specific property.
- **Response Example:**

```json
{
  "success": true,
  "data": {
    "_id": "abc123",
    "title": "Cozy Apartment",
    "description": "A beautiful apartment in the city center...",
    "category": { "_id": "65a1b2c3d4e5f67890a1b2c3", "name": "Apartment" },
    "owner": {
      "_id": "user1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "location": { "type": "Point", "coordinates": [77.5946, 12.9716] },
    "address": "123 Main St",
    "price": 1200,
    "images": ["https://.../img1.jpg", "https://.../img2.jpg"],
    "amenities": ["WiFi", "Parking"],
    "status": "approved",
    "isAvailable": true,
    "createdAt": "2024-06-01T12:00:00.000Z",
    "updatedAt": "2024-06-01T12:00:00.000Z"
  }
}
```

---

## 4. Filter & Search Properties

- **Endpoint:** `POST /api/properties/filter`
- **Description:** Filter and search properties by text, category, price, location, and amenities.
- **Request Body Example:**

```json
{
  "query": "wifi",
  "category": "65a1b2c3d4e5f67890a1b2c3",
  "price": { "min": 1000, "max": 2000 },
  "location": { "lat": 12.9716, "lng": 77.5946, "radius": 10 },
  "amenities": ["wifi"]
}
```

- **Response Example:**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "abc123",
      "title": "Cozy Apartment",
      "description": "A beautiful apartment in the city center...",
      "category": { "_id": "65a1b2c3d4e5f67890a1b2c3", "name": "Apartment" },
      "owner": { "_id": "user1", "firstName": "John", "lastName": "Doe" },
      "location": { "type": "Point", "coordinates": [77.5946, 12.9716] },
      "address": "123 Main St",
      "price": 1200,
      "images": ["https://.../img1.jpg"],
      "amenities": ["WiFi", "Parking"],
      "status": "approved",
      "isAvailable": true,
      "createdAt": "2024-06-01T12:00:00.000Z",
      "updatedAt": "2024-06-01T12:00:00.000Z"
    }
  ]
}
```

---

## 5. Search & Filter Properties

- **Endpoint:** `GET /api/properties/search?query=...&filters=...`
- **Description:** Search properties by keyword and apply advanced filters (price, amenities, etc.).

---

## 6. Favorite a Property

- **Endpoint:** `POST /api/properties/:id/favorite`
- **Description:** Mark a property as favorite for the logged-in user.
- **Request Body:** _None_
- **Response Example:**

```json
{
  "success": true,
  "message": "Property favorited"
}
```

---

## Endpoint Summary and Access Control

| Endpoint                                 | Method | Feature          | Allowed Roles      |
| ---------------------------------------- | ------ | ---------------- | ------------------ |
| GET /api/properties                      | GET    | View Properties  | user, owner, admin |
| GET /api/properties/:id                  | GET    | View Properties  | user, owner, admin |
| POST /api/properties/filter              | POST   | Filter/Search    | user               |
| POST /api/users/:id/favorites            | POST   | Save Favorites   | user               |
| GET /api/users/:id/favorites             | GET    | Save Favorites   | user               |
| GET /api/owner/properties                | GET    | List Properties  | owner, admin       |
| POST /api/owner/properties               | POST   | List Properties  | owner, admin       |
| PUT /api/owner/properties/:id            | PUT    | Edit Listings    | owner (own), admin |
| DELETE /api/owner/properties/:id         | DELETE | Edit Listings    | owner (own), admin |
| GET /api/admin/properties?status=pending | GET    | Moderate Content | admin              |
| POST /api/admin/properties/:id/approve   | POST   | Moderate Content | admin              |
| POST /api/admin/properties/:id/reject    | POST   | Moderate Content | admin              |
| POST /api/admin/owners/:id/ban           | POST   | Ban Users        | admin              |
