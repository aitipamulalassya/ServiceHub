import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const redirectUser = (role) => {
        if (role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/provider/dashboard");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", form);

            login(response.data);

            redirectUser(response.data.user.role);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        setError("");
        setGoogleLoading(true);

        try {
            const response = await api.post("/auth/google", {
                credential: credentialResponse.credential,
            });

            login(response.data);

            redirectUser(response.data.user.role);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Google login failed"
            );
        } finally {
            setGoogleLoading(false);
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
                        Service Provider Onboarding Portal
                    </p>

                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

                    <h2 className="text-2xl font-bold text-slate-900">
                        Welcome back
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Login to continue to ServiceHub
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
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
    name="email"
    value={form.email}
    onChange={handleChange}
    placeholder="you@example.com"
    className="!text-black !bg-white w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    required
/>
                        </div>

                        {/* Password */}
       {/* Password */}
<div>
    <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-slate-700">
            Password
        </label>

        <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
            Forgot password?
        </Link>
    </div>

    <div className="relative">
        <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="!text-black !bg-white w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
        />

        <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="!text-black !bg-white absolute right-2 top-1/2 -translate-y-1/2 z-10 px-2 py-1 text-sm font-bold"
        >
            {showPassword ? "Hide" : "Show"}
        </button>
    </div>
</div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-slate-200"></div>

                        <span className="px-4 text-xs text-slate-400">
                            OR
                        </span>

                        <div className="flex-1 border-t border-slate-200"></div>
                    </div>

                    {/* Google Login */}
                    <div className="flex justify-center">

                        <div className="w-full">

                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    setError(
                                        "Google login failed"
                                    );
                                    setGoogleLoading(false);
                                }}
                                useOneTap={false}
                            />

                        </div>

                    </div>

                    {googleLoading && (
                        <p className="mt-3 text-center text-sm text-slate-500">
                            Signing in with Google...
                        </p>
                    )}

                    {/* Register */}
                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Create account
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
};

export default Login;