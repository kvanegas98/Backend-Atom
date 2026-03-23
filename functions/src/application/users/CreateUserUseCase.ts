import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ConflictError } from "../../domain/errors/DomainError";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new ConflictError("User already exists");
    return this.userRepository.create(email);
  }
}
