import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { registerUser } from "../../features/auth/authSlice.js";

import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Loader2,
    Check,
} from "lucide-react";


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


    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


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
    // Handle Register
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // Password Match

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            toast.error(
                "Passwords do not match"
            );

            return;
        }


        // Password Length

        if (formData.password.length < 8) {

            toast.error(
                "Password must be at least 8 characters"
            );

            return;
        }


        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };


        const resultAction = await dispatch(
            registerUser(userData)
        );


        // Registration Success

        if (
            registerUser.fulfilled.match(
                resultAction
            )
        ) {

            toast.success(
                resultAction.payload.message ||
                "Account created successfully"
            );


            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            return;
        }


        // Registration Failed

        if (
            registerUser.rejected.match(
                resultAction
            )
        ) {

            toast.error(
                resultAction.payload ||
                "Registration failed"
            );
        }
    };


    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

            {/* Background */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

            </div>


            {/* Main */}

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
                        Start managing your leads smarter.
                    </p>

                </div>


                {/* Card */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8">

                    {/* Heading */}

                    <div className="mb-7">

                        <h2 className="text-2xl font-semibold text-white">
                            Create your account
                        </h2>


                        <p className="mt-2 text-sm text-slate-400">
                            Get started with Zalvix LeadOS today.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Name */}

                        <div>

                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Full name
                            </label>


                            <div className="relative">

                                <User
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500"
                                />


                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Muhammad Usman"
                                    autoComplete="name"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />

                            </div>

                        </div>


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

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Password
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
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
                                >

                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}

                                </button>

                            </div>


                            {/* Password requirement */}

                            <div className="mt-2 flex items-center gap-2">

                                <Check
                                    className={`h-4 w-4 ${
                                        formData.password.length >= 8
                                            ? "text-emerald-400"
                                            : "text-slate-600"
                                    }`}
                                />

                                <span className="text-xs text-slate-500">
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
                                Confirm password
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
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />


                                <button
                                    type="button"
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


                        {/* Error */}

                        {error && (

                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                                <p className="text-sm text-red-400">
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {isLoading ? (

                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating account...
                                </>

                            ) : (

                                <>
                                    Create account

                                    <ArrowRight
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    />
                                </>

                            )}

                        </button>

                    </form>


                    {/* Divider */}

                    <div className="my-7 flex items-center gap-4">

                        <div className="h-px flex-1 bg-slate-800" />

                        <span className="text-xs text-slate-600">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-800" />

                    </div>


                    {/* Login */}

                    <p className="text-center text-sm text-slate-400">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-blue-400 hover:text-blue-300 transition"
                        >
                            Sign in
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


export default Register;