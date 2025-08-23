import { defaultUser } from "../constants/defaultUser";
import { useStorageState } from "../hooks/useStorageState";
import { User } from "../types/user";
import { UserContext } from "./UserContext";
import { checkAndGenerateRecurringTasks } from "../utils/recurringUtils";
import { useEffect, useState } from "react";

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && user.tasks.length > 0) {
      const updatedTasks = checkAndGenerateRecurringTasks(user.tasks);
      if (updatedTasks.length !== user.tasks.length) {
        setUser((prevUser) => ({
          ...prevUser,
          tasks: updatedTasks,
        }));
      }
    }
  }, [isLoading, user.tasks, setUser]);

  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(
      () => {
        setUser((prevUser) => {
          const updatedTasks = checkAndGenerateRecurringTasks(prevUser.tasks);
          if (updatedTasks.length !== prevUser.tasks.length) {
            return {
              ...prevUser,
              tasks: updatedTasks,
            };
          }
          return prevUser;
        });
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [isLoading, setUser]);

  return (
    <UserContext.Provider value={{ user, setUser }}>{!isLoading && children}</UserContext.Provider>
  );
};
