
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Register from "../pages/auth/Register.jsx";
import Login from "../pages/auth/Login.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";


// Temporary Dashboard
const Dashboard = () => {
    return (
        <div>
            <h1>Welcome to Zalvix LeadOS Dashboard</h1>

            <p>
                Login successful.
            </p>
        </div>
    );
};


const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>

                {/* ==========================================
                    Dashboard
                ========================================== */}

                <Route
                    path="/"
                    element={<Dashboard />}
                />


                {/* ==========================================
                    Register
                ========================================== */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ==========================================
                    Login
                ========================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ==========================================
                    Forgot Password
                ========================================== */}

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />


                {/* ==========================================
                    Email Verification
                ========================================== */}
                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />
                <Route
                    path="/verify-email/:token"
                    element={<VerifyEmail />}
                />


                {/* ==========================================
                    Temporary 404
                ========================================== */}

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
    );
};


export default AppRoutes;

