export type Recurrence = "daily" | "weekly" | "monthly";

/**
 * Returns the next due date based on recurrence interval.
 */
export const getNextDueDate = (current: Date, recurrence: Recurrence): Date => {
  const next = new Date(current);
  switch (recurrence) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    default:
      break;
  }
  return next;
};
