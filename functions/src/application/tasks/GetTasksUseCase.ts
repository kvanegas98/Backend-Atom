import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { PaginationParams, PaginatedResult } from "../../domain/types/pagination";
import { Task } from "../../domain/entities/Task";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export class GetTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: string, params?: Partial<PaginationParams>): Promise<PaginatedResult<Task>> {
    const limit = Math.min(params?.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    return this.taskRepository.findByUserId(userId, { limit, cursor: params?.cursor });
  }
}
