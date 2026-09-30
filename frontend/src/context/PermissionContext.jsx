// src/context/PermissionContext.jsx
import { createContext, useContext } from "react";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  // This CRM currently has no /permissions/getRolePermissions backend route.
  // The configured users have full application access, so do not call the
  // legacy permissions endpoint (it only produced repeated 404 requests).
  const refreshPermissions = () => Promise.resolve();

  return (
    <PermissionContext.Provider
      value={{
        permissions: null,
        storeType: null,
        isProfileComplete: true,
        isSubscriptionActive: true,
        subscription: null,
        loading: false,
        refreshPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissionContext must be used within PermissionProvider");
  }
  return context;
};
