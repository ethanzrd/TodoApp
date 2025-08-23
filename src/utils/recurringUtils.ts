export const calculateNextOccurrence = (
  currentDate: Date,
  recurrence: { type: "daily" | "weekly" | "monthly"; interval: number },
): Date => {
  const nextDate = new Date(currentDate);

  switch (recurrence.type) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + recurrence.interval);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + recurrence.interval * 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + recurrence.interval);
      break;
  }

  return nextDate;
};
