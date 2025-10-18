import express from 'express'
import { deleteTasks, getAllTasks, createTasks, updateTasks } from '../controllers/tasksControllers.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get("/", auth, getAllTasks);

router.post("/", auth, createTasks);

router.put("/:id", auth, updateTasks);

router.delete("/:id", auth, deleteTasks);

export default router;