import { Task, CreateTaskProps, UpdateTaskProps } from "../entities/Task";
import { PaginationParams, PaginatedResult } from "../types/pagination";

export interface ITaskRepository {
  findByUserId(userId: string, params: PaginationParams): Promise<PaginatedResult<Task>>;
  findById(id: string): Promise<Task | null>;
  create(props: CreateTaskProps): Promise<Task>;
  update(id: string, props: UpdateTaskProps): Promise<Task>;
  delete(id: string): Promise<void>;
}
