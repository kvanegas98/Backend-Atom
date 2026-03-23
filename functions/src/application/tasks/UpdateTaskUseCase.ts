import { Task, UpdateTaskProps } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, props: UpdateTaskProps): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundError("Task");
    return this.taskRepository.update(id, props);
  }
}
