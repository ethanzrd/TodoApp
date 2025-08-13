import { useEffect } from "react";
import { defaultUser } from "../constants/defaultUser";
import { useStorageState } from "../hooks/useStorageState";
import { Task, User } from "../types/user";
import { UserContext } from "./UserContext";

function reviveDate(value: unknown): Date | unknown {
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  return value;
}

function reviveTaskDates(task: Task): Task {
  return {
    ...task,
    date: reviveDate(task.date) as Date,
    deadline: task.deadline ? (reviveDate(task.deadline) as Date) : undefined,
    lastSave: task.lastSave ? (reviveDate(task.lastSave) as Date) : undefined,
  };
}

function reviveUserDates(user: User): User {
  return {
    ...user,
    createdAt: reviveDate(user.createdAt) as Date,
    lastSyncedAt: user.lastSyncedAt ? (reviveDate(user.lastSyncedAt) as Date) : undefined,
    tasks: Array.isArray(user.tasks) ? user.tasks.map(reviveTaskDates) : [],
    deletedTasks: user.deletedTasks,
  };
}

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");

  useEffect(() => {
    const hasStringDatesInTasks = (arr: Task[]) =>
      Array.isArray(arr) &&
      arr.some(
        (t) =>
          typeof t.date === "string" ||
          typeof t.deadline === "string" ||
          typeof t.lastSave === "string",
      );

    const changed =
      typeof user.createdAt === "string" ||
      typeof user.lastSyncedAt === "string" ||
      hasStringDatesInTasks(user.tasks);

    if (changed) {
      const revived = reviveUserDates(user);
      setUser(revived);
    }
  }, [user, setUser]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
