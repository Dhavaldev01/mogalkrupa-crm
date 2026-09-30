import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { TooltipProvider } from "./components/ui/tooltip.jsx"
import { PermissionProvider } from "./context/PermissionContext.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PermissionProvider>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </PermissionProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors visibleToasts={5} expand />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)