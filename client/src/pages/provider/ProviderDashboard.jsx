import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const ProviderDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await api.get("/providers/profile");
            setProfile(response.data.profile || response.data);
        } catch (err) {
            console.error("Profile error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const calculateCompletion = () => {
        if (!profile) return 0;

        const fields = [
            !!profile.phone,
            profile.categories?.length > 0,
            profile.skills?.length > 0,
            profile.experience !== null &&
                profile.experience !== undefined &&
                profile.experience !== "",
            !!profile.location?.city,
            !!profile.location?.state,
            !!profile.location?.pincode,
            !!profile.profilePhoto,
            profile.documents?.length > 0,
        ];

        const completed = fields.filter(Boolean).length;

        return Math.round(
            (completed / fields.length) * 100
        );
    };

    const status = profile?.status || "draft";
    const completion = calculateCompletion();

    const statusStyles = {
        draft: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
        pending:
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
        approved:
            "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
        rejected:
            "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-300">
                        Loading dashboard...
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 transition-colors">

                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* Header */}
                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Provider Dashboard
                        </h1>

                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Manage your profile and track your application.
                        </p>

                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Profile Completion */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                        Profile Completion
                                    </h2>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Complete your profile to submit your application.
                                    </p>
                                </div>

                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {completion}%
                                </div>

                            </div>

                            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">

                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all"
                                    style={{
                                        width: `${completion}%`,
                                    }}
                                />

                            </div>

                        </div>

                        {/* Application Status */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Application Status
                            </h2>

                            <div className="mt-5">

                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${
                                        statusStyles[status]
                                    }`}
                                >
                                    {status}
                                </span>

                            </div>

                            {status === "rejected" &&
                                profile?.rejectionRemark && (
                                    <div className="mt-5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">

                                        <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                            Admin Remark
                                        </p>

                                        <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                                            {profile.rejectionRemark}
                                        </p>

                                    </div>
                                )}

                        </div>

                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6">

                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            <Link
                                to="/provider/profile"
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition"
                            >
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    My Profile
                                </h3>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Update your professional details.
                                </p>
                            </Link>

                            <Link
                                to="/provider/documents"
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition"
                            >
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Documents
                                </h3>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Upload verification documents.
                                </p>
                            </Link>

                            <Link
                                to="/provider/status"
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition"
                            >
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Application
                                </h3>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Track your application status.
                                </p>
                            </Link>

                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">

                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Documents
                                </h3>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {profile?.documents?.length || 0} document(s) uploaded.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </main>
        </>
    );
};

export default ProviderDashboard;