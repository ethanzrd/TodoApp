import { Task } from "../types/user";
import { generateUUID } from "./index";

/**
 * Calculate the next occurrence date based on recurrence type and interval
 */
export const calculateNextOccurrence = (
  currentDate: Date,
  recurrenceType: "daily" | "weekly" | "monthly",
  interval: number = 1,
): Date => {
  const nextDate = new Date(currentDate);

  switch (recurrenceType) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + interval);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + interval * 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
  }

  return nextDate;
};

/**
 * Create the next occurrence of a recurring task
 */
export const createNextOccurrence = (completedTask: Task): Task => {
  if (!completedTask.recurrenceType || completedTask.recurrenceType === "none") {
    throw new Error("Task is not recurring");
  }

  const interval = completedTask.recurrenceInterval || 1;
  const baseDate = completedTask.deadline || completedTask.date;
  const nextDeadline = calculateNextOccurrence(baseDate, completedTask.recurrenceType, interval);

  return {
    ...completedTask,
    id: generateUUID(),
    done: false,
    date: new Date(),
    deadline: nextDeadline,
    lastSave: undefined,
    position: undefined,
  };
};
