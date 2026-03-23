import { GetTasksUseCase } from "../../../src/application/tasks/GetTasksUseCase";
import { ITaskRepository } from "../../../src/domain/repositories/ITaskRepository";
import { Task } from "../../../src/domain/entities/Task";
import { PaginatedResult } from "../../../src/domain/types/pagination";

const mockTask: Task = {
  id: "1",
  userId: "user1",
  title: "Test task",
  description: "Test description",
  status: "pending",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const mockRepo: jest.Mocked<ITaskRepository> = {
  findByUserId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const paginatedOne: PaginatedResult<Task> = {
  data: [mockTask],
  nextCursor: null,
  hasMore: false,
};

const paginatedEmpty: PaginatedResult<Task> = {
  data: [],
  nextCursor: null,
  hasMore: false,
};

describe("GetTasksUseCase", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return paginated tasks for a given user", async () => {
    mockRepo.findByUserId.mockResolvedValue(paginatedOne);
    const useCase = new GetTasksUseCase(mockRepo);

    const result = await useCase.execute("user1");

    expect(result.data).toEqual([mockTask]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
    expect(mockRepo.findByUserId).toHaveBeenCalledWith("user1", { limit: 20, cursor: undefined });
  });

  it("should return empty data when user has no tasks", async () => {
    mockRepo.findByUserId.mockResolvedValue(paginatedEmpty);
    const useCase = new GetTasksUseCase(mockRepo);

    const result = await useCase.execute("user1");

    expect(result.data).toEqual([]);
    expect(mockRepo.findByUserId).toHaveBeenCalledTimes(1);
  });

  it("should cap limit at 100", async () => {
    mockRepo.findByUserId.mockResolvedValue(paginatedEmpty);
    const useCase = new GetTasksUseCase(mockRepo);

    await useCase.execute("user1", { limit: 999 });

    expect(mockRepo.findByUserId).toHaveBeenCalledWith("user1", { limit: 100, cursor: undefined });
  });

  it("should pass cursor to repository", async () => {
    const cursor = new Date("2024-06-01");
    mockRepo.findByUserId.mockResolvedValue(paginatedEmpty);
    const useCase = new GetTasksUseCase(mockRepo);

    await useCase.execute("user1", { cursor });

    expect(mockRepo.findByUserId).toHaveBeenCalledWith("user1", { limit: 20, cursor });
  });
});
