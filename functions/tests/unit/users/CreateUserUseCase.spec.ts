import { CreateUserUseCase } from "../../../src/application/users/CreateUserUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { User } from "../../../src/domain/entities/User";
import { ConflictError } from "../../../src/domain/errors/DomainError";

const mockUser: User = {
  id: "1",
  email: "new@test.com",
  createdAt: new Date(),
};

const mockRepo: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

describe("CreateUserUseCase", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create and return a new user", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(mockUser);
    const useCase = new CreateUserUseCase(mockRepo);

    const result = await useCase.execute("new@test.com");

    expect(result).toEqual(mockUser);
    expect(mockRepo.create).toHaveBeenCalledWith("new@test.com");
  });

  it("should throw ConflictError when user already exists", async () => {
    mockRepo.findByEmail.mockResolvedValue(mockUser);
    const useCase = new CreateUserUseCase(mockRepo);

    await expect(useCase.execute("new@test.com")).rejects.toThrow(ConflictError);

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
