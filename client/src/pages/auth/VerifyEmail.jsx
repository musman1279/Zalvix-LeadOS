import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { verifyEmail } from "../../features/auth/authService.js";

import {
    ShieldCheck,
    MailCheck,
    XCircle,
    Loader2,
    ArrowRight,
    LogIn,
} from "lucide-react";


const VerifyEmail = () => {

    const { token } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);


    // ==========================================
    // Verify Email
    // ==========================================

    useEffect(() => {

        const handleVerifyEmail = async () => {

            try {

                const response = await verifyEmail(token);


                if (response.success) {

                    setIsVerified(true);

                    toast.success(
                        response.message ||
                        "Email verified successfully"
                    );
                }

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Email verification failed"
                );

            } finally {

                setIsLoading(false);

            }
        };


        if (token) {

            handleVerifyEmail();

        } else {

            setIsLoading(false);

            toast.error(
                "Verification token is missing"
            );
        }

    }, [token]);


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
                        Secure your account and get started.
                    </p>

                </div>


                {/* ==========================================
                    Verification Card
                ========================================== */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8">


                    {/* ==========================================
                        Loading State
                    ========================================== */}

                    {isLoading && (

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">

                                <Loader2
                                    className="h-8 w-8 text-blue-400 animate-spin"
                                />

                            </div>


                            <h2 className="mt-6 text-2xl font-semibold text-white">
                                Verifying your email
                            </h2>


                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Please wait while we verify your email
                                address. This should only take a moment.
                            </p>

                        </div>

                    )}


                    {/* ==========================================
                        Success State
                    ========================================== */}

                    {!isLoading && isVerified && (

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">

                                <MailCheck
                                    className="h-8 w-8 text-emerald-400"
                                />

                            </div>


                            <h2 className="mt-6 text-2xl font-semibold text-white">
                                Email verified!
                            </h2>


                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Your email address has been successfully
                                verified. Your account is now ready to use.
                            </p>


                            {/* Success Badge */}

                            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">

                                <MailCheck className="h-4 w-4 text-emerald-400" />

                                <span className="text-sm font-medium text-emerald-300">
                                    Verification completed
                                </span>

                            </div>


                            {/* Login Button */}

                            <Link
                                to="/login"
                                className="group mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
                            >

                                <LogIn className="h-5 w-5" />

                                Go to Login

                                <ArrowRight
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                />

                            </Link>

                        </div>

                    )}


                    {/* ==========================================
                        Failed State
                    ========================================== */}

                    {!isLoading && !isVerified && (

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">

                                <XCircle
                                    className="h-8 w-8 text-red-400"
                                />

                            </div>


                            <h2 className="mt-6 text-2xl font-semibold text-white">
                                Verification failed
                            </h2>


                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                This verification link is invalid or has
                                expired. Please request a new verification
                                email and try again.
                            </p>


                            {/* Error Badge */}

                            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                                <p className="text-sm text-red-400">
                                    Your email could not be verified.
                                </p>

                            </div>


                            {/* Login Button */}

                            <Link
                                to="/login"
                                className="group mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >

                                <LogIn className="h-5 w-5" />

                                Back to Login

                                <ArrowRight
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                />

                            </Link>

                        </div>

                    )}

                </div>


                {/* ==========================================
                    Footer
                ========================================== */}

                <p className="mt-6 text-center text-xs text-slate-600">
                    © {new Date().getFullYear()} Zalvix LeadOS. All rights reserved.
                </p>

            </div>

        </div>
    );
};


export default VerifyEmail;