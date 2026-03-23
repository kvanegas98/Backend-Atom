import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { FirestoreUserRepository } from "../repositories/FirestoreUserRepository";

/**
 * Factory + Singleton for IUserRepository.
 * Reuses the same Firestore connection across requests.
 */
export class UserRepositoryFactory {
  private static instance: IUserRepository | null = null;

  static create(): IUserRepository {
    if (!UserRepositoryFactory.instance) {
      UserRepositoryFactory.instance = new FirestoreUserRepository();
    }
    return UserRepositoryFactory.instance;
  }
}
