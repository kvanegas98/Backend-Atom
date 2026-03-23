import { DeleteTaskUseCase } from "../../../src/application/tasks/DeleteTaskUseCase";
import { ITaskRepository } from "../../../src/domain/repositories/ITaskRepository";
import { Task } from "../../../src/domain/entities/Task";
import { NotFoundError } from "../../../src/domain/errors/DomainError";

const mockTask: Task = {
  id: "1",
  userId: "user1",
  title: "Task",
  description: "Desc",
  status: "pending",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo: jest.Mocked<ITaskRepository> = {
  findByUserId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe("DeleteTaskUseCase", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should delete the task when it exists", async () => {
    mockRepo.findById.mockResolvedValue(mockTask);
    mockRepo.delete.mockResolvedValue(undefined);
    const useCase = new DeleteTaskUseCase(mockRepo);

    await useCase.execute("1");

    expect(mockRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw NotFoundError when task does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);
    const useCase = new DeleteTaskUseCase(mockRepo);

    await expect(useCase.execute("nonexistent")).rejects.toThrow(NotFoundError);

    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
