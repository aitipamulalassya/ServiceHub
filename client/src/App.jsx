import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/provider/Profile";
import Documents from "./pages/provider/Documents";
import Status from "./pages/provider/Status";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProviderDetails from "./pages/admin/ProviderDetails";
const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/provider/dashboard"
                        element={
                            <ProtectedRoute role="provider">
                               <ProviderDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>

<Route
    path="/reset-password/:token"
    element={<ResetPassword />}
/>
<Route
    path="/provider/profile"
    element={
        <ProtectedRoute role="provider">
           <Profile/>
        </ProtectedRoute>
    }
/>

<Route
    path="/provider/documents"
    element={
        <ProtectedRoute role="provider">
            <Documents/>
        </ProtectedRoute>
    }
/>

<Route
    path="/provider/status"
    element={
        <ProtectedRoute role="provider">
            <Status/>
        </ProtectedRoute>
    }
/>
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDashboard/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
  path="/admin/providers/:id"
  element={
    <ProtectedRoute role="admin">
      <ProviderDetails />
    </ProtectedRoute>
  }
/>

                    <Route
                        path="/unauthorized"
                        element={
                            <h1>
                                Unauthorized Access
                            </h1>
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
                    />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;