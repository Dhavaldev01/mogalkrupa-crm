import ProtectedRoute from "@/routes/ProtectedRoute"
import PublicRoute from "@/routes/PublicRoute"
import { Route, Routes, Navigate } from "react-router-dom"
import LoginLayout from "./layout/LoginLayout"
import MainLayout from "./layout/MainLayout"
import NotFound from "./pages/404/NotFound"
import CreateBill from "./pages/createBill/Main"
import Customers from "./pages/customers/Main"
import Dashboard from "./pages/dashboard/Main"
import CustomerDetails from "./pages/customerDetails/Main"
import Login from "./pages/login/Main"
import Settings from "./pages/settings/Main"
import ForgotPassword from "./pages/forgotPassword/Main"
import CreateNewPassword from "./pages/createNewPassword/Main"
import Rates from "./pages/rates/Main"
import Invoices from "./pages/invoices/Main"
import InvoicePrint from "./pages/invoices/InvoicePrint"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* PUBLIC */}
        <Route element={<PublicRoute />}>
          <Route element={<LoginLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-new-password" element={<CreateNewPassword />} />
          </Route>
        </Route>

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/billing/create" element={<CreateBill />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<InvoicePrint />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

