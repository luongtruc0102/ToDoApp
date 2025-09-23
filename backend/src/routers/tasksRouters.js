import express from 'express'
import { deleteTasks, getAllTasks, createTasks, updateTasks } from '../controllers/tasksControllers.js';

const router = express.Router();

router.get("/", getAllTasks);

router.post("/", createTasks);

router.put("/:id", updateTasks);

router.delete("/:id", deleteTasks);

export default router;