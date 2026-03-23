import { UpdateTaskUseCase } from "../../../src/application/tasks/UpdateTaskUseCase";
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

describe("UpdateTaskUseCase", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should update and return the task", async () => {
    const updated: Task = { ...mockTask, status: "completed" };
    mockRepo.findById.mockResolvedValue(mockTask);
    mockRepo.update.mockResolvedValue(updated);
    const useCase = new UpdateTaskUseCase(mockRepo);

    const result = await useCase.execute("1", { status: "completed" });

    expect(result.status).toBe("completed");
    expect(mockRepo.update).toHaveBeenCalledWith("1", { status: "completed" });
  });

  it("should throw NotFoundError when task does not exist", async () => {
    mockRepo.findById.mockResolvedValue(null);
    const useCase = new UpdateTaskUseCase(mockRepo);

    await expect(
      useCase.execute("nonexistent", { status: "completed" })
    ).rejects.toThrow(NotFoundError);

    expect(mockRepo.update).not.toHaveBeenCalled();
  });
});
