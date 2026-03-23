import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { FirestoreTaskRepository } from "../repositories/FirestoreTaskRepository";

/**
 * Factory + Singleton for ITaskRepository.
 * Reuses the same Firestore connection across requests.
 */
export class TaskRepositoryFactory {
  private static instance: ITaskRepository | null = null;

  static create(): ITaskRepository {
    if (!TaskRepositoryFactory.instance) {
      TaskRepositoryFactory.instance = new FirestoreTaskRepository();
    }
    return TaskRepositoryFactory.instance;
  }
}
