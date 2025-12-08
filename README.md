# Todo-list-api

## Background

A todo API demonstrating CRUD operations, filtering with RBAC.

- Registered users can create todos, and all registered users can view all Todos, searching todos by multiple criteria.
- Only the owner of a Todo can update or delete it. Visitors(not logged in) cannot access todos.
- Register and login endpoints are provided.

## API Endpoints

| Method | Endpoint           | Description                                                                      | Auth | Validation |
| :----- | ------------------ | -------------------------------------------------------------------------------- | ---- | ---------- |
| POST   | /api/auth/register | User registration                                                                | NO   | YES        |
| POST   | /api/auth/login    | User login, returns JWT token                                                    | NO   | YES        |
| GET    | /api/todos         | Search Todos, optional filters: title, description, category, completed, ownerId | YES  | NO         |
| POST   | /api/todos         | Create a new Todo                                                                | YES  | YES        |
| PUT    | /api/todos/:id     | Update a Todo (owner only)                                                       | YES  | YES        |
| DELETE | /api/todos/:id     | Delete a Todo (owner only)                                                       | YES  | NO         |

## Local Setup & Testing instructions

1. Setup:

```bash
git clone <repo>
cd <projectfolder>
npm install
```

2. Start the server:

```bash
npm run dev
```

3. Run tests:

```bash
npm test
```

4. Testing the API with Postman

* Register a user via /api/auth/register.
* Login via /api/auth/login to generate a JWT token and save it.
* Include the token in the Authorization header of requests to protected endpoints: Authorization: Bearer token

## Limitations & Future Improvements

* **Test coverage** : Tests focus on critical and boundary cases, not complete coverage.
* **Controller logic** : Business logic is simple and can be refactored into services for clearer separation in the future.
* **Validation** : Currently custom middleware; could be replaced with a library like validator for simplicity.
* **Time constraints** : Limited time for extra features; core functionality prioritized.
