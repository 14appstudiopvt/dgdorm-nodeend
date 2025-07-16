# Locations (Countries & Cities) API Reference

This document describes the API for managing countries and cities, suitable for integration with the Flutter admin panel frontend.

---

## 1. Endpoints Overview

### Countries

| Operation | HTTP Method | Path                 |
| --------- | ----------- | -------------------- |
| Create    | POST        | `/api/countries`     |
| List      | GET         | `/api/countries`     |
| Update    | PUT         | `/api/countries/:id` |
| Delete    | DELETE      | `/api/countries/:id` |

### Cities (within a Country)

| Operation | HTTP Method | Path                                       |
| --------- | ----------- | ------------------------------------------ |
| Create    | POST        | `/api/countries/:countryId/cities`         |
| Update    | PUT         | `/api/countries/:countryId/cities/:cityId` |
| Delete    | DELETE      | `/api/countries/:countryId/cities/:cityId` |

### Dropdown (All countries and their cities, for dropdowns)

- GET `/api/countries/dropdown`

---

## 2. Request Format

### Country

#### Create Country (`POST /api/countries`)

```json
{
  "name": "Nigeria", // string, required
  "lat": 9.082, // number, optional
  "long": 8.6753 // number, optional
}
```

#### Update Country (`PUT /api/countries/:id`)

```json
{
  "name": "Nigeria", // string, required
  "lat": 9.082, // number, optional
  "long": 8.6753 // number, optional
}
```

### City

#### Create City (`POST /api/countries/:countryId/cities`)

```json
{
  "name": "Lagos", // string, required
  "lat": 6.5244, // number, required
  "long": 3.3792 // number, required
}
```

#### Update City (`PUT /api/countries/:countryId/cities/:cityId`)

```json
{
  "name": "Lagos", // string, required
  "lat": 6.5244, // number, required
  "long": 3.3792 // number, required
}
```

---

## 3. Response Format

### Success

- **List Countries**

  ```json
  {
    "data": [
      {
        "_id": "countryId",
        "name": "Nigeria",
        "lat": 9.082,
        "long": 8.6753,
        "cities": [
          {
            "_id": "cityId",
            "name": "Lagos",
            "lat": 6.5244,
            "long": 3.3792
          }
        ]
      }
    ]
  }
  ```

- **Create/Update Country or City**

  ```json
  {
    "data": {
      // country object (with cities array)
    }
  }
  ```

- **Delete Country**

  ```json
  {
    "message": "Country deleted"
  }
  ```

- **Delete City**
  ```json
  {
    "data": {
      // updated country object (with cities array)
    }
  }
  ```

### Error

- **General Error**

  ```json
  {
    "error": "Error message"
  }
  ```

- **Not Found**

  ```json
  {
    "error": "Country not found"
  }
  ```

  or

  ```json
  {
    "error": "City not found"
  }
  ```

- **Validation Error**
  ```json
  {
    "error": "Field 'name' is required"
  }
  ```

---

## 4. Field Types

- `name`: string (required for both country and city)
- `lat`: number (required for city, optional for country)
- `long`: number (required for city, optional for country)
- `cities`: array of city objects (each with `_id`, `name`, `lat`, `long`)

---

## 5. Validation & Error Handling

- **Missing required fields**: Returns 400 with `{ "error": "Field 'name' is required" }`
- **Not found**: Returns 404 with `{ "error": "Country not found" }` or `{ "error": "City not found" }`
- **Other errors**: Returns 400 or 500 with `{ "error": "Error message" }`
- **All errors**: Always returned as `{ "error": ... }` with appropriate HTTP status.

---

## 6. Sample Payloads

### Create Country (Request)

```json
{
  "name": "Ghana",
  "lat": 7.9465,
  "long": -1.0232
}
```

### Create Country (Success Response)

```json
{
  "data": {
    "_id": "countryId",
    "name": "Ghana",
    "lat": 7.9465,
    "long": -1.0232,
    "cities": []
  }
}
```

### Create City (Request)

```json
{
  "name": "Accra",
  "lat": 5.6037,
  "long": -0.187
}
```

### Create City (Success Response)

```json
{
  "data": {
    "_id": "countryId",
    "name": "Ghana",
    "lat": 7.9465,
    "long": -1.0232,
    "cities": [
      {
        "_id": "cityId",
        "name": "Accra",
        "lat": 5.6037,
        "long": -0.187
      }
    ]
  }
}
```

### Error (e.g., missing name)

```json
{
  "error": "Field 'name' is required"
}
```

---

## 7. Special Notes & Edge Cases

- **Empty lists**: If no countries or cities exist, `"data": []` is returned.
- **lat/long**: Always numbers. If not provided for country, may be `null` or omitted.
- **cities**: Always an array (may be empty).
- **Unique country name**: Country names must be unique; duplicate names will return an error.
- **City IDs**: Cities are embedded in the country document and have their own `_id`.
- **Dropdown endpoint**: Returns only `name` and `cities` for each country, for lightweight dropdowns.

---
