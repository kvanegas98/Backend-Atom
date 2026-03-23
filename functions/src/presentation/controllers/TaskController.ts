import { Response, NextFunction } from "express";
import { GetTasksUseCase } from "../../application/tasks/GetTasksUseCase";
import { CreateTaskUseCase } from "../../application/tasks/CreateTaskUseCase";
import { UpdateTaskUseCase } from "../../application/tasks/UpdateTaskUseCase";
import { DeleteTaskUseCase } from "../../application/tasks/DeleteTaskUseCase";
import { TaskRepositoryFactory } from "../../infrastructure/factories/TaskRepositoryFactory";
import { UpdateTaskDto } from "../dtos/task.dto";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export class TaskController {
  static async getTasks(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit, cursor } = req.query;
      // userId siempre del token, nunca del query string
      const userId = req.user!.userId;

      const useCase = new GetTasksUseCase(TaskRepositoryFactory.create());
      const result = await useCase.execute(userId, {
        limit: limit !== undefined ? Number(limit) : undefined,
        cursor: cursor !== undefined ? new Date(cursor as string) : undefined,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async createTask(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // userId del token, se ignora si viene en el body
      const payload = { ...req.body, userId: req.user!.userId };
      const useCase = new CreateTaskUseCase(TaskRepositoryFactory.create());
      const task = await useCase.execute(payload);
      res.status(201).json({ data: task });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const useCase = new UpdateTaskUseCase(TaskRepositoryFactory.create());
      const task = await useCase.execute(id, req.body as UpdateTaskDto);
      res.json({ data: task });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const useCase = new DeleteTaskUseCase(TaskRepositoryFactory.create());
      await useCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
