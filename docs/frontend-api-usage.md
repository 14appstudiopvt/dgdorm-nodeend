# Frontend Integration Guide: Country, City, Property, and Category APIs

## 1. API Response Format

All successful API responses now return:

- For lists:  
  `{ "data": [ ... ] }`
- For single objects:  
  `{ "data": { ... } }`
- For errors:  
  `{ "error": "Error message" }`
- For actions (like delete):  
  `{ "message": "Action completed" }`

---

## 2. Country & City Management

### Endpoints

| Action             | Method | Endpoint                                             | Body / Params         | Description                                      |
| ------------------ | ------ | ---------------------------------------------------- | --------------------- | ------------------------------------------------ |
| Add Country        | POST   | `/api/locations/countries`                           | `{ name, lat, long }` | Add a new country                                |
| List All Countries | GET    | `/api/locations/countries`                           |                       | Get all countries (with cities)                  |
| Update Country     | PUT    | `/api/locations/countries/:id`                       | `{ name, lat, long }` | Update a country                                 |
| Delete Country     | DELETE | `/api/locations/countries/:id`                       |                       | Delete a country                                 |
| Add City           | POST   | `/api/locations/countries/:countryId/cities`         | `{ name, lat, long }` | Add a city to a country                          |
| Update City        | PUT    | `/api/locations/countries/:countryId/cities/:cityId` | `{ name, lat, long }` | Update a city in a country                       |
| Delete City        | DELETE | `/api/locations/countries/:countryId/cities/:cityId` |                       | Delete a city from a country                     |
| Dropdown Data      | GET    | `/api/locations/dropdown`                            |                       | Get all countries and their cities for dropdowns |

### Sample Dropdown Response

```json
{
  "data": [
    {
      "_id": "countryId",
      "name": "Pakistan",
      "lat": 30.3753,
      "long": 69.3451,
      "cities": [
        {
          "_id": "cityId1",
          "name": "Peshawar",
          "lat": 34.0151,
          "long": 71.5805
        }
      ]
    },
    {
      "_id": "countryId2",
      "name": "UAE",
      "lat": 23.4241,
      "long": 53.8478,
      "cities": [
        {
          "_id": "cityId2",
          "name": "Dubai",
          "lat": 25.276987,
          "long": 55.296249
        }
      ]
    }
  ]
}
```

### Frontend Usage

- Fetch countries and cities for dropdowns:
  ```js
  const response = await fetch("/api/locations/dropdown");
  const countries = (await response.json()).data;
  // Use countries for country dropdown, and countries[index].cities for city dropdown
  ```
- When submitting a property, send the selected country and city IDs.

---

## 3. Property APIs

### Endpoints

| Action             | Method | Endpoint                    | Description                        |
| ------------------ | ------ | --------------------------- | ---------------------------------- |
| List Properties    | GET    | `/api/properties`           | Get all approved properties        |
| Get Property By ID | GET    | `/api/properties/:id`       | Get a single property              |
| Filter Properties  | POST   | `/api/properties/filter`    | Filter/search properties           |
| Create Property    | POST   | `/api/properties`           | Create a new property (owner only) |
| Update Property    | PUT    | `/api/owner/properties/:id` | Update a property (owner only)     |
| Delete Property    | DELETE | `/api/owner/properties/:id` | Delete a property (owner only)     |

### Sample List Response

```json
{
  "data": [
    {
      "_id": "propertyId",
      "title": "Nice Apartment",
      "country": { "_id": "countryId", "name": "Pakistan" },
      "city": { "_id": "cityId", "name": "Peshawar" }
      // ...other fields
    }
  ],
  "count": 1,
  "pagination": { "total": 1, "page": 1, "pages": 1 }
}
```

### Frontend Usage

- Fetch properties:
  ```js
  const response = await fetch("/api/properties");
  const properties = (await response.json()).data;
  ```
- Display property location:
  ```js
  property.country.name; // e.g., "Pakistan"
  property.city.name; // e.g., "Peshawar"
  ```
- When creating/updating, send selected country/city IDs.

---

## 4. Category APIs

### Endpoints

| Action          | Method | Endpoint              | Description           |
| --------------- | ------ | --------------------- | --------------------- |
| List Categories | GET    | `/api/categories`     | Get all categories    |
| Create Category | POST   | `/api/categories`     | Create a new category |
| Update Category | PUT    | `/api/categories/:id` | Update a category     |
| Delete Category | DELETE | `/api/categories/:id` | Delete a category     |

### Sample List Response

```json
{
  "data": [
    {
      "_id": "categoryId",
      "name": "Apartment",
      "description": "A nice apartment"
      // ...other fields
    }
  ]
}
```

### Frontend Usage

- Fetch categories for dropdowns:
  ```js
  const response = await fetch("/api/categories");
  const categories = (await response.json()).data;
  ```

---

## 5. Error Handling

All errors are returned as:

```json
{ "error": "Error message" }
```

Check for the presence of the `error` field in your frontend and handle accordingly.

---

## 6. General Tips

- Always access the main data via the `data` field in the response.
- For lists, `data` is an array. For single objects, `data` is an object.
- For actions (like delete), check the `message` field.
- For errors, check the `error` field.

---

## 7. Example: Fetching and Displaying Countries and Cities

```js
// Fetch countries and cities for dropdowns
const response = await fetch("/api/locations/dropdown");
const countries = (await response.json()).data;

// Populate country dropdown
countries.forEach((country) => {
  // country.name, country._id
  // For each country, you can access country.cities (array)
});
```

---

If you need code samples for a specific frontend framework (React, Vue, Flutter, etc.), let the backend team know!
