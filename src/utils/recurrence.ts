import { Task } from "../types/user";
import { generateUUID } from "./generateUUID";

export const createNextRecurringTask = (task: Task): Task | null => {
  if (!task.recurrence || !task.deadline) return null;
  const nextDeadline = new Date(task.deadline);
  switch (task.recurrence) {
    case "daily":
      nextDeadline.setDate(nextDeadline.getDate() + 1);
      break;
    case "weekly":
      nextDeadline.setDate(nextDeadline.getDate() + 7);
      break;
    case "monthly":
      nextDeadline.setMonth(nextDeadline.getMonth() + 1);
      break;
    default:
      return null;
  }
  return {
    ...task,
    id: generateUUID(),
    done: false,
    date: new Date(),
    deadline: nextDeadline,
    lastSave: undefined,
  };
};
