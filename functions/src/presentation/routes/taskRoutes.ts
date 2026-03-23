import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { validateBody, validateQuery } from "../middlewares/validateRequest";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CreateTaskSchema, UpdateTaskSchema, GetTasksQuerySchema } from "../dtos/task.dto";

const router = Router();

router.use(authMiddleware);

router.get("/", validateQuery(GetTasksQuerySchema), TaskController.getTasks);
router.post("/", validateBody(CreateTaskSchema), TaskController.createTask);
router.put("/:id", validateBody(UpdateTaskSchema), TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export default router;
