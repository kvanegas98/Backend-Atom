import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { NotFoundError } from "../../domain/errors/DomainError";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundError("Task");
    return this.taskRepository.delete(id);
  }
}
