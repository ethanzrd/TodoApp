import type { Task } from "../types/user";
import { generateUUID } from "./index";

export const calculateNextOccurrence = (
  lastDate: Date,
  frequency: "daily" | "weekly" | "monthly" | "yearly",
  interval: number,
): Date => {
  const nextDate = new Date(lastDate);

  switch (frequency) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + interval);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + interval * 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + interval);
      break;
  }

  return nextDate;
};

export const shouldGenerateNextInstance = (task: Task): boolean => {
  if (!task.recurring || !task.recurring.nextOccurrence) return false;

  const now = new Date();
  const nextOccurrence = new Date(task.recurring.nextOccurrence);

  return nextOccurrence <= now;
};

export const generateRecurringInstance = (parentTask: Task): Task => {
  if (!parentTask.recurring) throw new Error("Task is not recurring");

  const nextOccurrence = parentTask.recurring.nextOccurrence || new Date();

  const newTask: Task = {
    ...parentTask,
    id: generateUUID(),
    done: false,
    date: new Date(nextOccurrence),
    deadline: parentTask.deadline
      ? new Date(
          new Date(parentTask.deadline).getTime() +
            (nextOccurrence.getTime() - new Date(parentTask.date).getTime()),
        )
      : undefined,
    parentTaskId: parentTask.id,
    lastSave: new Date(),
    recurring: undefined,
  };

  return newTask;
};

export const updateParentTaskNextOccurrence = (parentTask: Task): Task => {
  if (!parentTask.recurring) return parentTask;

  const nextOccurrence = calculateNextOccurrence(
    parentTask.recurring.nextOccurrence || parentTask.date,
    parentTask.recurring.frequency,
    parentTask.recurring.interval,
  );

  return {
    ...parentTask,
    recurring: {
      ...parentTask.recurring,
      nextOccurrence,
    },
    lastSave: new Date(),
  };
};

export const checkAndGenerateRecurringTasks = (tasks: Task[]): Task[] => {
  const newTasks: Task[] = [];
  const updatedTasks: Task[] = [];

  tasks.forEach((task) => {
    if (task.recurring && !task.parentTaskId && shouldGenerateNextInstance(task)) {
      const newInstance = generateRecurringInstance(task);
      newTasks.push(newInstance);

      const updatedParent = updateParentTaskNextOccurrence(task);
      updatedTasks.push(updatedParent);
    } else {
      updatedTasks.push(task);
    }
  });

  return [...updatedTasks, ...newTasks];
};

export const getRecurringFrequencyLabel = (
  frequency: "daily" | "weekly" | "monthly" | "yearly",
): string => {
  switch (frequency) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "yearly":
      return "Yearly";
    default:
      return frequency;
  }
};

export const formatRecurringDescription = (recurring: Task["recurring"]): string => {
  if (!recurring) return "";

  const frequencyLabel = getRecurringFrequencyLabel(recurring.frequency);
  const intervalText = recurring.interval === 1 ? "" : `Every ${recurring.interval} `;

  let description = `${intervalText}${frequencyLabel}`;

  if (recurring.endDate) {
    const endDate = new Date(recurring.endDate).toLocaleDateString();
    description += ` until ${endDate}`;
  }

  return description;
};
