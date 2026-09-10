import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                `/auth/reset-password/${token}`,
                {
                    password: form.password,
                    confirmPassword: form.confirmPassword,
                }
            );

            setSuccess(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to reset password"
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
                        Create a new password
                    </p>

                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

                    <h2 className="text-2xl font-bold text-slate-900">
                        Reset Password
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Enter and confirm your new password below.
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mt-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-5"
                    >

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                New password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 6 characters"
                                    minLength={6}
                                    className="!text-black !bg-white w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 px-2 py-1 !text-black !bg-white text-sm font-bold hover:bg-slate-100"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm new password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    minLength={6}
                                    className="!text-black !bg-white w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 px-2 py-1 !text-black !bg-white text-sm font-bold hover:bg-slate-100"
                                >
                                    {showConfirmPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Resetting password..."
                                : "Set New Password"}
                        </button>

                    </form>

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

export default ResetPassword;