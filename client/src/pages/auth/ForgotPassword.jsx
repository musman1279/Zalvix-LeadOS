
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
    Mail,
    ArrowRight,
    ShieldCheck,
    Loader2,
    ArrowLeft,
} from "lucide-react";

import { forgotPassword } from "../../features/auth/authSlice.js";


const ForgotPassword = () => {

    const [email, setEmail] = useState("");

    const [isSubmitted, setIsSubmitted] = useState(false);


    // ==========================================
    // Redux
    // ==========================================

    const dispatch = useDispatch();

    const {
        isSendingResetEmail,
        error,
    } = useSelector((state) => state.auth);


    // ==========================================
    // Handle Submit
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            await dispatch(
                forgotPassword(email)
            ).unwrap();


            // ==========================================
            // Success
            // ==========================================

            setIsSubmitted(true);

            toast.success(
                "If an account exists, a reset email has been sent."
            );

        } catch (errorMessage) {

            // ==========================================
            // Error
            // ==========================================

            toast.error(
                errorMessage ||
                "Failed to send password reset email"
            );
        }
    };


    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

            {/* ==========================================
                Background Decoration
            ========================================== */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

            </div>


            {/* ==========================================
                Main Container
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
                        Secure access to your account.
                    </p>

                </div>


                {/* ==========================================
                    Card
                ========================================== */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8">


                    {!isSubmitted ? (

                        <>
                            {/* ==========================================
                                Heading
                            ========================================== */}

                            <div className="mb-7">

                                <h2 className="text-2xl font-semibold text-white">
                                    Forgot your password?
                                </h2>


                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    No worries. Enter your email address and
                                    we'll send you a link to reset your password.
                                </p>

                            </div>


                            {/* ==========================================
                                Form
                            ========================================== */}

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
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            required
                                            disabled={isSendingResetEmail}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                        />

                                    </div>

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
                                    disabled={isSendingResetEmail}
                                    className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {isSendingResetEmail ? (

                                        <>
                                            <Loader2
                                                className="h-5 w-5 animate-spin"
                                            />

                                            Sending reset link...
                                        </>

                                    ) : (

                                        <>
                                            Send reset link

                                            <ArrowRight
                                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                            />
                                        </>

                                    )}

                                </button>

                            </form>


                            {/* Back Login */}

                            <Link
                                to="/login"
                                className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition"
                            >

                                <ArrowLeft className="h-4 w-4" />

                                Back to login

                            </Link>

                        </>

                    ) : (

                        /* ==========================================
                           Email Sent State
                        ========================================== */

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">

                                <Mail
                                    className="h-8 w-8 text-emerald-400"
                                />

                            </div>


                            <h2 className="mt-6 text-2xl font-semibold text-white">
                                Check your email
                            </h2>


                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                If an account exists for
                                <span className="font-medium text-slate-300">
                                    {" "}{email}
                                </span>
                                , we've sent instructions to reset your password.
                            </p>


                            {/* Info */}

                            <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3">

                                <p className="text-sm text-blue-300">
                                    Check your inbox and spam folder.
                                </p>

                            </div>


                            {/* Login */}

                            <Link
                                to="/login"
                                className="group mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
                            >

                                Back to login

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


export default ForgotPassword;

