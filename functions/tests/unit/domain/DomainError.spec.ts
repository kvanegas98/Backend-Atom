import {
  DomainError,
  NotFoundError,
  ConflictError,
  ValidationError,
  UnauthorizedError,
} from "../../../src/domain/errors/DomainError";

describe("DomainError", () => {
  it("should set message and default statusCode", () => {
    const error = new DomainError("something failed");
    expect(error.message).toBe("something failed");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("DomainError");
    expect(error).toBeInstanceOf(Error);
  });

  it("should allow custom statusCode", () => {
    const error = new DomainError("custom", 418);
    expect(error.statusCode).toBe(418);
  });
});

describe("NotFoundError", () => {
  it("should set 404 and formatted message", () => {
    const error = new NotFoundError("Task");
    expect(error.message).toBe("Task not found");
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe("NotFoundError");
    expect(error).toBeInstanceOf(DomainError);
  });
});

describe("ConflictError", () => {
  it("should set 409", () => {
    const error = new ConflictError("Email already exists");
    expect(error.message).toBe("Email already exists");
    expect(error.statusCode).toBe(409);
    expect(error.name).toBe("ConflictError");
    expect(error).toBeInstanceOf(DomainError);
  });
});

describe("ValidationError", () => {
  it("should set 422", () => {
    const error = new ValidationError("Invalid input");
    expect(error.message).toBe("Invalid input");
    expect(error.statusCode).toBe(422);
    expect(error.name).toBe("ValidationError");
    expect(error).toBeInstanceOf(DomainError);
  });
});

describe("UnauthorizedError", () => {
  it("should set 401 with default message", () => {
    const error = new UnauthorizedError();
    expect(error.message).toBe("Unauthorized");
    expect(error.statusCode).toBe(401);
    expect(error.name).toBe("UnauthorizedError");
    expect(error).toBeInstanceOf(DomainError);
  });

  it("should set custom message", () => {
    const error = new UnauthorizedError("Token expired");
    expect(error.message).toBe("Token expired");
  });
});
