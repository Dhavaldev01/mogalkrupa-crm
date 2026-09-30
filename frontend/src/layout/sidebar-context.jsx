import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <SidebarContext.Provider
            value={{
                open,
                openSidebar: () => setOpen(true),
                closeSidebar: () => setOpen(false),
                toggleSidebar: () => setOpen(v => !v),
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error("useSidebar must be used inside SidebarProvider");
    }

    return context;
}