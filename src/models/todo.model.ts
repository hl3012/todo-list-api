import { v4 as uuidv4 } from "uuid";

/**
 * Represent a todo item in this system
 */
export interface Todo {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Object used when creating a todo */
export interface TodoCreate {
  ownerId: string;
  title: string;
  description: string;
  category: string;
}

/**
 * Partial object used when updating a todo
 * All fields are optional and can be combined
 */
export interface TodoUpdate {
  title?: string;
  description?: string;
  category?: string;
  completed?: boolean;
}

/**
 * Filters can be applied when querying todos
 * All filters are optional and can be combined
 */
export interface Filters {
  title?: string;
  description?: string;
  category?: string;
  completed?: boolean;
  ownerId?: string;
}

/**
 * In-memory todo repository for managing todos
 * - Uses async methods to simulate database operations
 * - Can be replaced with a real database in production
 * - Supports CRUD operations
 */
export class TodoModel {
  /** In-memory storage for todos */
  private static todos: Todo[] = [];

  /** Find todo by unique identifier */
  static async findById(id: string): Promise<Todo | null> {
    return this.todos.find((t) => t.id === id) || null;
  }

  /**
   * Find all todos with optional filters
   * @param filters - optional filter criteria for title, description, category, completed, ownerId
   * @returns Promise resolving to all todos that match the filters (empty array if none match)
   * @remarks
   * - All filters are optional; multiple filters can be combined;
   * - Description filter performs a partial match and case-insensitive
   * - Allother filters are exact matches if provided
   */
  static async findAllTodos(filters?: Filters): Promise<Todo[]> {
    let filteredTodos = this.todos;
    if (filters) {
      if (filters.title)
        filteredTodos = filteredTodos.filter((t) => t.title === filters.title);
      if (filters.description)
        filteredTodos = filteredTodos.filter((t) =>
          t.description
            .toLowerCase()
            .includes(filters.description!.toLowerCase())
        );
      if (filters.category)
        filteredTodos = filteredTodos.filter(
          (t) => t.category === filters.category
        );
      if (filters.completed != undefined)
        filteredTodos = filteredTodos.filter(
          (t) => t.completed === filters.completed
        );
      if (filters.ownerId)
        filteredTodos = filteredTodos.filter(
          (t) => t.ownerId === filters.ownerId
        );
    }
    return filteredTodos;
  }

  /**
   * Create a new todo item and store in memory
   * @param data - TodoCreate object containing ownerId, title, description, category
   * @returns Promise resolving to the newly created todo
   */
  static async create(data: TodoCreate): Promise<Todo> {
    const newTodo: Todo = {
      id: uuidv4(),
      ...data,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.push(newTodo);
    return newTodo;
  }

  /**
   * Update an existing todo item in memory
   * @param id - the id of the todo item to update
   * @param updates - TodoUpdate containing fields to update
   * @returns Promise resolving to the updated todo, otherwise null
   * @remarks If updates is empty, the todo item will not be updated
   */
  static async update(id: string, updates: TodoUpdate): Promise<Todo | null> {
    const todo = await this.findById(id);
    if (!todo) return null;

    if (!updates || Object.keys(updates).length === 0) return todo;

    Object.assign(todo, updates);
    todo.updatedAt = new Date();
    return todo;
  }

  /**
   * Delete an existing todo item in memory
   * @param id - the id of the todo item to delete
   * @returns Promise resolving to true if the todo item was deleted, otherwise false
   */
  static async delete(id: string): Promise<boolean> {
    const todo = await this.findById(id);
    if (!todo) return false;

    this.todos = this.todos.filter((t) => t.id !== id);
    return true;
  }

  /**
   * Clear all todos (testing use)
   */
  static async reset() {
    this.todos = [];
  }
}
