# Todo-list-api

## Background

A simple todo API demonstrating CRUD operations, filtering, and access control

- All registered users can view all Todos, search by multiple criteria, and create new Todos.
- Only the owner of a Todo can update or delete it.
- Register and login endpoints are provided.

---

## API Endpoints

| Method | Endpoint               | Description                                                                      | Auth | Validation |
| :----- | ---------------------- | -------------------------------------------------------------------------------- | ---- | ---------- |
| POST   | `/api/auth/register` | User registration                                                                | NO   | YES        |
| POST   | `/api/auth/login`    | User login, returns JWT                                                          | NO   | YES        |
| GET    | `/api/todos`         | Search Todos, optional filters: title, description, category, completed, ownerId | YES  | NO         |
| POST   | `/api/todos`         | Create a new Todo                                                                | YES  | YES        |
| PUT    | `/api/todos/:id`     | Update a specific Todo (owner only)                                              | YES  | YES        |
| DELETE | `/api/todos/:id`     | Delete a specific Todo (owner only)                                              | YES  | NO         |

---

## Local Setup & Testing instructions

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd <project-folder>
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

* **Register a user** via `/api/auth/register`.
* **Login** via `/api/auth/login` to generate a JWT token and save it.
* **Include the token** in the `Authorization` header of requests to protected endpoints: Authorization: Bearer `<your-token>`

## Limitations & Future Improvements

* **Test coverage** : Tests focus on critical features and boundary cases, not complete coverage.
* **Controller logic** : Business logic is simple and can be refactored into services for clearer separation in the future.
* **Validation** : Currently custom middleware; could be replaced with a library like validator for simplicity and consistency.
* **Time constraints** : Limited time for extra features; core functionality prioritized.
