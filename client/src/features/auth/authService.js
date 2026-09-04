import api from "../../services/api.js";

// Register User
export const registerUser = async (userData) => {
    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};


// Login User
export const loginUser = async (credentials) => {
    const response = await api.post(
        "/auth/login",
        credentials
    );

    return response.data;
};


// Logout User
export const logoutUser = async () => {
    const response = await api.post(
        "/auth/logout"
    );

    return response.data;
};


// Get Current Logged-in User
export const getCurrentUser = async () => {
    const response = await api.get(
        "/auth/me"
    );

    return response.data;
};


// Verify Email
export const verifyEmail = async (token) => {
    const response = await api.get(
        `/auth/verify-email/${token}`
    );

    return response.data;
};


// Resend Verification Email
export const resendVerificationEmail = async (email) => {
    const response = await api.post(
        "/auth/resend-verification-email",
        { email }
    );

    return response.data;
};


// Forgot Password
export const forgotPassword = async (email) => {
    const response = await api.post(
        "/auth/forgot-password",
        { email }
    );

    return response.data;
};


// Reset Password
export const resetPassword = async (
    token,
    passwordData
) => {
    const response = await api.post(
        `/auth/reset-password/${token}`,
        passwordData
    );

    return response.data;
};