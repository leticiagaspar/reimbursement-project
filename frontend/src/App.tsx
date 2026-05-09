import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/reimbursements/Dashboard";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import Home from "./pages/Home";
import { NewReimbursement } from "./pages/reimbursements/NewReimbursement";
import { ReimbursementDetail } from "./pages/reimbursements/ReimbursementDetails";
import { EditReimbursement } from "./pages/reimbursements/EditReimbursement";
import { CategoryManagement } from "./pages/categories/CategoryManagement";
import { Users } from "./pages/users/Users";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { AuthenticatedLayout } from "./components/AuthenticatedLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { Role } from "./interfaces/enum";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/reimbursements" element={<Dashboard />} />
              <Route
                path="/reimbursements/new"
                element={<NewReimbursement />}
              />
              <Route
                path="/reimbursements/:id"
                element={<ReimbursementDetail />}
              />
              <Route
                path="/reimbursements/:id/edit"
                element={<EditReimbursement />}
              />

              <Route element={<PrivateRoute allowedRoles={[Role.ADMIN]} />}>
                <Route path="/categories" element={<CategoryManagement />} />
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
