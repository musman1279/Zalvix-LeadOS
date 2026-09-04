import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

import {
    registerUser as registerUserService,
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
// Initial State
// ==========================================

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};


// ==========================================
// Auth Slice
// ==========================================

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },


        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },


        clearError: (state) => {
            state.error = null;
        },
    },


    // ==========================================
    // AsyncThunk States
    // ==========================================

    extraReducers: (builder) => {

        // Register Pending
        builder.addCase(
            registerUser.pending,
            (state) => {
                state.isLoading = true;
                state.error = null;
            }
        );


        // Register Success
        builder.addCase(
            registerUser.fulfilled,
            (state, action) => {
                state.isLoading = false;

                // Backend response se user
                state.user =
                    action.payload.user;

                // User register hone ke baad
                // authentication true
                state.isAuthenticated = true;

                state.error = null;
            }
        );


        // Register Failed
        builder.addCase(
            registerUser.rejected,
            (state, action) => {
                state.isLoading = false;

                state.error =
                    action.payload;
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


export default authSlice.reducer;