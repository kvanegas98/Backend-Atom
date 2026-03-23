import { Task, CreateTaskProps } from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(props: CreateTaskProps): Promise<Task> {
    return this.taskRepository.create(props);
  }
}
