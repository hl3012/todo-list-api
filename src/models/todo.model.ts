import { v4 as uuidv4 } from "uuid";

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

export interface TodoUpdate {
  title?: string;
  description?: string;
  category?: string;
  completed?: boolean;
}

export interface Filters {
  title?: string;
  description?: string;
  category?: string;
  completed?: boolean;
  ownerId?: string;
}

export class TodoModel {
  private static todos: Todo[] = [];

  static findById(id: string): Todo | null {
    return this.todos.find((t) => t.id === id) || null;
  }

  static findByOwnerId(ownerId: string): Todo | null {
    return this.todos.find((t) => t.ownerId === ownerId) || null;
  }

  static findAllTodos(filters?: Filters): Todo[] {
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

  static async create(
    ownerId: string,
    title: string,
    description: string,
    category: string
  ): Promise<Todo> {
    const newTodo: Todo = {
      id: uuidv4(),
      title,
      description,
      category,
      completed: false,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.push(newTodo);
    return newTodo;
  }

  static async update(id: string, updates: TodoUpdate): Promise<Todo | null> {
    const todo = this.findById(id);
    if (!todo) return null;

    if (!updates || Object.keys(updates).length === 0) return todo;

    Object.assign(todo, updates);
    todo.updatedAt = new Date();
    return todo;
  }

  static async delete(id: string): Promise<Boolean> {
    const todo = this.findById(id);
    if (!todo) return false;

    this.todos = this.todos.filter((t) => t.id !== id);
    return true;
  }

  static reset() {
    this.todos = [];
  }
}
