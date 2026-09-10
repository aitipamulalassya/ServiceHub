import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [resetUrl, setResetUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setResetUrl("");
        setLoading(true);

        try {
            const response = await api.post("/auth/forgot-password", {
                email,
            });

            setMessage(response.data.message);

            // Demo mode:
            // Backend returns the reset URL because
            // email notifications are not being used.
            if (response.data.resetUrl) {
                setResetUrl(response.data.resetUrl);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to process your request"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white text-2xl font-bold shadow-lg">
                        S
                    </div>

                    <h1 className="mt-4 text-3xl font-bold text-slate-900">
                        ServiceHub
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Reset your account password
                    </p>

                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

                    <h2 className="text-2xl font-bold text-slate-900">
                        Forgot Password?
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Enter your registered email address and we'll
                        generate a password reset link.
                    </p>

                    {/* Success */}
                    {message && (
                        <div className="mt-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Generating reset link..."
                                : "Generate Reset Link"}
                        </button>

                    </form>

                    {/* Demo Reset Link */}
                    {resetUrl && (
                        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">

                            <p className="text-xs font-semibold text-blue-800 mb-2">
                                DEMO RESET LINK
                            </p>

                            <a
                                href={resetUrl}
                                className="text-sm text-blue-600 hover:text-blue-700 break-all underline"
                            >
                                {resetUrl}
                            </a>

                        </div>
                    )}

                    {/* Login */}
                    <p className="mt-6 text-center text-sm text-slate-500">
                        Remember your password?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Login
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;