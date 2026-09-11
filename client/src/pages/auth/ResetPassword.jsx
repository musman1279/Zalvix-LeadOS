
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import { resetPassword } from "../../features/auth/authSlice.js";


const ResetPassword = () => {

    // ==========================================
    // Get Token From URL
    // ==========================================

    const { token } = useParams();


    // ==========================================
    // Form State
    // ==========================================

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });


    // ==========================================
    // Password Visibility
    // ==========================================

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    // ==========================================
    // Success State
    // ==========================================

    const [isReset, setIsReset] = useState(false);


    // ==========================================
    // Redux
    // ==========================================

    const dispatch = useDispatch();

    const {
        isResettingPassword,
        error,
    } = useSelector((state) => state.auth);


    // ==========================================
    // Handle Input
    // ==========================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // ==========================================
    // Handle Reset Password
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // ==========================================
        // Check Token
        // ==========================================

        if (!token) {

            toast.error(
                "Invalid or missing reset token."
            );

            return;
        }


        // ==========================================
        // Password Match
        // ==========================================

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            toast.error(
                "Passwords do not match"
            );

            return;
        }


        // ==========================================
        // Password Length
        // ==========================================

        if (formData.password.length < 8) {

            toast.error(
                "Password must be at least 8 characters"
            );

            return;
        }


        // ==========================================
        // Reset Password API
        // ==========================================

        try {

            await dispatch(
                resetPassword({
                    token,

                    passwordData: {
                        password: formData.password,
                        confirmPassword:
                            formData.confirmPassword,
                    },
                })
            ).unwrap();


            // ==========================================
            // Success
            // ==========================================

            setIsReset(true);

            toast.success(
                "Password reset successfully"
            );

        } catch (errorMessage) {

            // ==========================================
            // Error
            // ==========================================

            toast.error(
                errorMessage ||
                "Failed to reset password"
            );
        }
    };


    // ==========================================
    // Password Strength
    // ==========================================

    const passwordValid =
        formData.password.length >= 8;


    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

            {/* ==========================================
                Background
            ========================================== */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

            </div>


            {/* ==========================================
                Main
            ========================================== */}

            <div className="relative w-full max-w-md">


                {/* ==========================================
                    Brand
                ========================================== */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 mb-4">

                        <ShieldCheck
                            className="h-7 w-7 text-white"
                        />

                    </div>


                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Zalvix LeadOS
                    </h1>


                    <p className="mt-2 text-sm text-slate-400">
                        Create a new secure password.
                    </p>

                </div>


                {/* ==========================================
                    Card
                ========================================== */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8">


                    {/* ==========================================
                        Invalid Token
                    ========================================== */}

                    {!token && (

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">

                                <XCircle
                                    className="h-8 w-8 text-red-400"
                                />

                            </div>


                            <h2 className="mt-6 text-2xl font-semibold text-white">
                                Invalid reset link
                            </h2>


                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                This password reset link is missing
                                or invalid.
                            </p>


                            <Link
                                to="/forgot-password"
                                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-indigo-500"
                            >
                                Request a new link
                            </Link>

                        </div>

                    )}


                    {/* ==========================================
                        Reset Form
                    ========================================== */}

                    {token && !isReset && (

                        <>

                            <div className="mb-7">

                                <h2 className="text-2xl font-semibold text-white">
                                    Reset your password
                                </h2>


                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    Choose a strong password for your
                                    Zalvix LeadOS account.
                                </p>

                            </div>


                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                {/* Password */}

                                <div>

                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-300 mb-2"
                                    >
                                        New password
                                    </label>


                                    <div className="relative">

                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500"
                                        />


                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter new password"
                                            autoComplete="new-password"
                                            required
                                            disabled={
                                                isResettingPassword
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                        />


                                        <button
                                            type="button"
                                            disabled={
                                                isResettingPassword
                                            }
                                            onClick={() =>
                                                setShowPassword(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                                        >

                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}

                                        </button>

                                    </div>


                                    {/* Password Requirement */}

                                    <div className="mt-2 flex items-center gap-2">

                                        {passwordValid ? (

                                            <CheckCircle2
                                                className="h-4 w-4 text-emerald-400"
                                            />

                                        ) : (

                                            <div className="h-4 w-4 rounded-full border border-slate-600" />

                                        )}


                                        <span
                                            className={`text-xs ${
                                                passwordValid
                                                    ? "text-emerald-400"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            At least 8 characters
                                        </span>

                                    </div>

                                </div>


                                {/* Confirm Password */}

                                <div>

                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-slate-300 mb-2"
                                    >
                                        Confirm new password
                                    </label>


                                    <div className="relative">

                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500"
                                        />


                                        <input
                                            id="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={
                                                formData.confirmPassword
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Confirm new password"
                                            autoComplete="new-password"
                                            required
                                            disabled={
                                                isResettingPassword
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                        />


                                        <button
                                            type="button"
                                            disabled={
                                                isResettingPassword
                                            }
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                                        >

                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}

                                        </button>

                                    </div>


                                    {/* Match */}

                                    {formData.confirmPassword && (

                                        <p
                                            className={`mt-2 text-xs ${
                                                formData.password ===
                                                formData.confirmPassword
                                                    ? "text-emerald-400"
                                                    : "text-red-400"
                                            }`}
                                        >

                                            {formData.password ===
                                            formData.confirmPassword
                                                ? "Passwords match"
                                                : "Passwords do not match"}

                                        </p>

                                    )}

                                </div>


                                {/* Redux Error */}

                                {error && (

                                    <p className="text-sm text-red-400">
                                        {error}
                                    </p>

                                )}


                                {/* Submit */}

                                <button
                                    type="submit"
                                    disabled={
                                        isResettingPassword
                                    }
                                    className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {isResettingPassword ? (

                                        <>
                                            <Loader2
                                                className="h-5 w-5 animate-spin"
                                            />

                                            Resetting password...
                                        </>

                                    ) : (

                                        <>
                                            Reset password

                                            <ArrowRight
                                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                            />

                                        </>

                                    )}

                                </button>

                            </form>

                        </>

                    )}


                    {/* ==========================================
                        Success
                    ========================================== */}

                    {isReset && (

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">

                                <CheckCircle2
                                    className="h-8 w-8 text-emerald-400"
                                />

                            </div>


                            <h2 className="mt-6 text-2xl font-semibold text-white">
                                Password reset successful
                            </h2>


                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Your password has been updated successfully.
                                You can now sign in using your new password.
                            </p>


                            <Link
                                to="/login"
                                className="group mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
                            >

                                Go to login

                                <ArrowRight
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                />

                            </Link>

                        </div>

                    )}

                </div>


                {/* Footer */}

                <p className="mt-6 text-center text-xs text-slate-600">
                    © {new Date().getFullYear()} Zalvix LeadOS. All rights reserved.
                </p>

            </div>

        </div>
    );
};


export default ResetPassword;

