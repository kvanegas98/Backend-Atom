export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateTaskProps {
  userId: string;
  title: string;
  description: string;
}

export interface UpdateTaskProps {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
