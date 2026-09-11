import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    registerUser as registerUserService,
    loginUser as loginUserService,
    resendVerificationEmail as resendVerificationEmailService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
} from "./authService.js";


// ==========================================
// Register User AsyncThunk
// ==========================================

export const registerUser = createAsyncThunk(
    "auth/registerUser",

    async (userData, { rejectWithValue }) => {
        try {
            const response =
                await registerUserService(userData);

            return response;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    }
);


// ==========================================
// Login User AsyncThunk
// ==========================================

export const loginUser = createAsyncThunk(
    "auth/loginUser",

    async (credentials, { rejectWithValue }) => {
        try {
            const response =
                await loginUserService(credentials);

            return response;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }
);


// ==========================================
// Resend Verification Email AsyncThunk
// ==========================================

export const resendVerificationEmail = createAsyncThunk(
    "auth/resendVerificationEmail",

    async (email, { rejectWithValue }) => {
        try {
            const response =
                await resendVerificationEmailService(email);

            return response;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to resend verification email"
            );
        }
    }
);


// ==========================================
// Forgot Password AsyncThunk
// ==========================================

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",

    async (email, { rejectWithValue }) => {
        try {
            const response =
                await forgotPasswordService(email);

            return response;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to send password reset email"
            );
        }
    }
);


// ==========================================
// Reset Password AsyncThunk
// ==========================================

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",

    async ({ token, passwordData }, { rejectWithValue }) => {
        try {
            const response =
                await resetPasswordService(
                    token,
                    passwordData
                );

            return response;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to reset password"
            );
        }
    }
);


// ==========================================
// Initial State
// ==========================================

const initialState = {
    user: null,
    isAuthenticated: false,

    // General authentication loading
    isLoading: false,

    // Resend verification
    isResendingVerification: false,

    // Forgot password
    isSendingResetEmail: false,

    // Reset password
    isResettingPassword: false,

    error: null,
};


// ==========================================
// Auth Slice
// ==========================================

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        // ==========================================
        // Set User
        // ==========================================

        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },


        // ==========================================
        // Clear User
        // ==========================================

        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },


        // ==========================================
        // Clear Error
        // ==========================================

        clearError: (state) => {
            state.error = null;
        },
    },


    extraReducers: (builder) => {

        // ==========================================
        // Register User
        // ==========================================

        builder
            .addCase(
                registerUser.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )

            .addCase(
                registerUser.fulfilled,
                (state, action) => {
                    state.isLoading = false;

                    state.user =
                        action.payload.user || null;

                    // User must verify email first
                    state.isAuthenticated = false;

                    state.error = null;
                }
            )

            .addCase(
                registerUser.rejected,
                (state, action) => {
                    state.isLoading = false;

                    state.error =
                        action.payload ||
                        "Registration failed";
                }
            );


        // ==========================================
        // Login User
        // ==========================================

        builder
            .addCase(
                loginUser.pending,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )

            .addCase(
                loginUser.fulfilled,
                (state, action) => {
                    state.isLoading = false;

                    state.user =
                        action.payload.user;

                    state.isAuthenticated = true;

                    state.error = null;
                }
            )

            .addCase(
                loginUser.rejected,
                (state, action) => {
                    state.isLoading = false;

                    state.error =
                        action.payload ||
                        "Login failed";
                }
            );


        // ==========================================
        // Resend Verification Email
        // ==========================================

        builder
            .addCase(
                resendVerificationEmail.pending,
                (state) => {
                    state.isResendingVerification = true;
                    state.error = null;
                }
            )

            .addCase(
                resendVerificationEmail.fulfilled,
                (state) => {
                    state.isResendingVerification = false;
                    state.error = null;
                }
            )

            .addCase(
                resendVerificationEmail.rejected,
                (state, action) => {
                    state.isResendingVerification = false;

                    state.error =
                        action.payload ||
                        "Failed to resend verification email";
                }
            );


        // ==========================================
        // Forgot Password
        // ==========================================

        builder
            .addCase(
                forgotPassword.pending,
                (state) => {
                    state.isSendingResetEmail = true;
                    state.error = null;
                }
            )

            .addCase(
                forgotPassword.fulfilled,
                (state) => {
                    state.isSendingResetEmail = false;
                    state.error = null;
                }
            )

            .addCase(
                forgotPassword.rejected,
                (state, action) => {
                    state.isSendingResetEmail = false;

                    state.error =
                        action.payload ||
                        "Failed to send password reset email";
                }
            );


        // ==========================================
        // Reset Password
        // ==========================================

        builder
            .addCase(
                resetPassword.pending,
                (state) => {
                    state.isResettingPassword = true;
                    state.error = null;
                }
            )

            .addCase(
                resetPassword.fulfilled,
                (state) => {
                    state.isResettingPassword = false;
                    state.error = null;
                }
            )

            .addCase(
                resetPassword.rejected,
                (state, action) => {
                    state.isResettingPassword = false;

                    state.error =
                        action.payload ||
                        "Failed to reset password";
                }
            );
    },
});


// ==========================================
// Export Actions
// ==========================================

export const {
    setUser,
    clearUser,
    clearError,
} = authSlice.actions;


// ==========================================
// Export Reducer
// ==========================================

export default authSlice.reducer;