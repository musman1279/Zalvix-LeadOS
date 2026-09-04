import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Register from "../pages/auth/Register.jsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/register"
                            replace
                        />
                    }
                />

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Temporary 404 */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/register"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;