import { FindUserUseCase } from "../../../src/application/users/FindUserUseCase";
import { IUserRepository } from "../../../src/domain/repositories/IUserRepository";
import { User } from "../../../src/domain/entities/User";

const mockUser: User = {
  id: "1",
  email: "test@test.com",
  createdAt: new Date(),
};

const mockRepo: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

describe("FindUserUseCase", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return the user when found", async () => {
    mockRepo.findByEmail.mockResolvedValue(mockUser);
    const useCase = new FindUserUseCase(mockRepo);

    const result = await useCase.execute("test@test.com");

    expect(result).toEqual(mockUser);
    expect(mockRepo.findByEmail).toHaveBeenCalledWith("test@test.com");
  });

  it("should return null when user does not exist", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    const useCase = new FindUserUseCase(mockRepo);

    const result = await useCase.execute("notfound@test.com");

    expect(result).toBeNull();
  });
});
