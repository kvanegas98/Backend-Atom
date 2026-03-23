import { Request, Response, NextFunction } from "express";
import { FindUserUseCase } from "../../application/users/FindUserUseCase";
import { CreateUserUseCase } from "../../application/users/CreateUserUseCase";
import { UserRepositoryFactory } from "../../infrastructure/factories/UserRepositoryFactory";
import { JwtService } from "../../infrastructure/auth/JwtService";

export class UserController {
  static async findUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const email = decodeURIComponent(req.params["email"]);
      const useCase = new FindUserUseCase(UserRepositoryFactory.create());
      const user = await useCase.execute(email);

      if (!user) {
        res
          .status(404)
          .json({ error: "NotFoundError", message: "User not found" });
        return;
      }

      const token = JwtService.sign({ userId: user.id, email: user.email });
      res.json({ data: user, token });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body as { email: string };
      const useCase = new CreateUserUseCase(UserRepositoryFactory.create());
      const user = await useCase.execute(email);
      const token = JwtService.sign({ userId: user.id, email: user.email });
      res.status(201).json({ data: user, token });
    } catch (error) {
      next(error);
    }
  }
}
