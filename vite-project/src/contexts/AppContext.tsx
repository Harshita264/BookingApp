import React, { useContext, useEffect, useState } from "react";
import Toast from "../components/Toast";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  showToast: (toastMessage: ToastMessage) => void;
  logout: () => Promise<void>;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // 🔑 AUTH CHECK (ONCE)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiClient.validateToken();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ LOGOUT HANDLER
  const logout = async () => {
    await apiClient.logout();
    setIsLoggedIn(false);
  };

  const showToast = (toastMessage: ToastMessage) => {
    setToast(toastMessage);
  };

  if(isLoading) {
    return null;
  }


  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        showToast,
        logout,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};
