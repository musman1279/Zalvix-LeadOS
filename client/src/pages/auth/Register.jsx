import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../../features/auth/authSlice.js";

const Register = () => {
    const dispatch = useDispatch();

    const {
        isLoading,
        error,
    } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };

        try {
            const resultAction = await dispatch(
                registerUser(userData)
            );

            if (registerUser.fulfilled.match(resultAction)) {
                toast.success(
                    resultAction.payload.message ||
                    "Registration successful"
                );

                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
            }

        } catch (error) {
            toast.error(
                error.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div>
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Name</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                </div>

                <div>
                    <label>Confirm Password</label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                    />
                </div>

                {error && (
                    <p>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Creating Account..."
                        : "Create Account"}
                </button>

            </form>

            <p>
                Already have an account?{" "}

                <Link to="/login">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;