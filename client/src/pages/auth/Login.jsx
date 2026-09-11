import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    loginUser,
    resendVerificationEmail,
} from "../../features/auth/authSlice.js";

import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Loader2,
} from "lucide-react";


const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        isLoading,
        isResendingVerification,
        error,
    } = useSelector((state) => state.auth);


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const [showPassword, setShowPassword] = useState(false);


    // ==========================================
    // Handle Input Change
    // ==========================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // ==========================================
    // Handle Login
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        const resultAction = await dispatch(
            loginUser(formData)
        );


        // Login Success

        if (loginUser.fulfilled.match(resultAction)) {

            toast.success(
                resultAction.payload.message ||
                "Login successful"
            );

            navigate("/");
        }


        // Login Failed

        if (loginUser.rejected.match(resultAction)) {

            toast.error(
                resultAction.payload ||
                "Login failed"
            );
        }
    };


    // ==========================================
    // Resend Verification Email
    // ==========================================

    const handleResendVerification = async () => {

        if (!formData.email) {

            toast.error(
                "Please enter your email first"
            );

            return;
        }


        const resultAction = await dispatch(
            resendVerificationEmail(formData.email)
        );


        // Success

        if (
            resendVerificationEmail.fulfilled.match(
                resultAction
            )
        ) {

            toast.success(
                resultAction.payload.message ||
                "Verification email sent successfully"
            );

            return;
        }


        // Failed

        if (
            resendVerificationEmail.rejected.match(
                resultAction
            )
        ) {

            toast.error(
                resultAction.payload ||
                "Failed to resend verification email"
            );
        }
    };


    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

            {/* Background decoration */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

            </div>


            {/* Main Container */}

            <div className="relative w-full max-w-md">

                {/* Brand */}

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
                        Manage your leads. Grow your business.
                    </p>

                </div>


                {/* Card */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8">

                    {/* Heading */}

                    <div className="mb-7">

                        <h2 className="text-2xl font-semibold text-white">
                            Welcome back
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Sign in to continue to your dashboard.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Email address
                            </label>


                            <div className="relative">

                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500"
                                />


                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-300"
                                >
                                    Password
                                </label>


                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition"
                                >
                                    Forgot password?
                                </Link>

                            </div>


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
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                                <p className="text-sm text-red-400">
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* Login Button */}

                        <button
                            type="submit"
                            disabled={
                                isLoading ||
                                isResendingVerification
                            }
                            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {isLoading ? (

                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing in...
                                </>

                            ) : (

                                <>
                                    Sign in

                                    <ArrowRight
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    />
                                </>

                            )}

                        </button>


                        {/* Resend Verification */}

                        {error ===
                            "Please verify your email before logging in" && (

                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">

                                <div className="flex gap-3">

                                    <div className="mt-0.5">

                                        <Mail className="h-5 w-5 text-amber-400" />

                                    </div>


                                    <div className="flex-1">

                                        <p className="text-sm font-medium text-amber-300">
                                            Email verification required
                                        </p>


                                        <p className="mt-1 text-xs leading-5 text-amber-200/70">
                                            Please verify your email before signing in.
                                        </p>


                                        <button
                                            type="button"
                                            onClick={
                                                handleResendVerification
                                            }
                                            disabled={
                                                isResendingVerification
                                            }
                                            className="mt-3 text-sm font-semibold text-amber-300 hover:text-amber-200 disabled:opacity-50"
                                        >

                                            {isResendingVerification ? (
                                                <span className="flex items-center gap-2">

                                                    <Loader2 className="h-4 w-4 animate-spin" />

                                                    Sending email...

                                                </span>
                                            ) : (
                                                "Resend verification email"
                                            )}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )}

                    </form>


                    {/* Divider */}

                    <div className="my-7 flex items-center gap-4">

                        <div className="h-px flex-1 bg-slate-800" />

                        <span className="text-xs text-slate-600">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-800" />

                    </div>


                    {/* Register */}

                    <p className="text-center text-sm text-slate-400">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-blue-400 hover:text-blue-300 transition"
                        >
                            Create account
                        </Link>

                    </p>

                </div>


                {/* Footer */}

                <p className="mt-6 text-center text-xs text-slate-600">
                    © {new Date().getFullYear()} Zalvix LeadOS. All rights reserved.
                </p>

            </div>

        </div>
    );
};


export default Login;