import { Task } from "../types/user";
import { generateUUID } from "./generateUUID";

export const getNextOccurrence = (task: Task): Task => {
  const nextDeadline = task.deadline ? new Date(task.deadline) : undefined;
  if (nextDeadline) {
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
    }
  }

  return {
    ...task,
    id: generateUUID(),
    done: false,
    date: new Date(),
    deadline: nextDeadline,
    lastSave: new Date(),
  };
};
