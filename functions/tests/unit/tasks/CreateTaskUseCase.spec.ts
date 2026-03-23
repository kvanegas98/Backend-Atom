import { CreateTaskUseCase } from "../../../src/application/tasks/CreateTaskUseCase";
import { ITaskRepository } from "../../../src/domain/repositories/ITaskRepository";
import { Task } from "../../../src/domain/entities/Task";

const mockTask: Task = {
  id: "1",
  userId: "user1",
  title: "New task",
  description: "A description",
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

describe("CreateTaskUseCase", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create and return a new task", async () => {
    mockRepo.create.mockResolvedValue(mockTask);
    const useCase = new CreateTaskUseCase(mockRepo);

    const result = await useCase.execute({
      userId: "user1",
      title: "New task",
      description: "A description",
    });

    expect(result).toEqual(mockTask);
    expect(mockRepo.create).toHaveBeenCalledWith({
      userId: "user1",
      title: "New task",
      description: "A description",
    });
  });

  it("should propagate repository errors", async () => {
    mockRepo.create.mockRejectedValue(new Error("DB error"));
    const useCase = new CreateTaskUseCase(mockRepo);

    await expect(
      useCase.execute({ userId: "user1", title: "Task", description: "" })
    ).rejects.toThrow("DB error");
  });
});
