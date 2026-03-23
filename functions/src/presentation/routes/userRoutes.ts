import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateBody } from "../middlewares/validateRequest";
import { CreateUserSchema } from "../dtos/user.dto";

const router = Router();

router.get("/:email", UserController.findUser);
router.post("/", validateBody(CreateUserSchema), UserController.createUser);

export default router;
