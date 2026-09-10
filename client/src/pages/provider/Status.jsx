import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const Status = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState("draft");
    const [remark, setRemark] = useState("");
    const [submittedAt, setSubmittedAt] = useState(null);
    const [reviewedAt, setReviewedAt] = useState(null);
const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            setError("");

            const response = await api.get(
                "/providers/status"
            );

            console.log(
                "STATUS API RESPONSE:",
                response.data
            );

            const data = response.data;

            const application =
                data.application ||
                data.statusData ||
                data.profile ||
                data;

            setStatus(
                application.status || "draft"
            );

            setRemark(
                application.rejectionRemark || ""
            );

            setSubmittedAt(
                application.submittedAt || null
            );

            setReviewedAt(
                application.reviewedAt || null
            );
        } catch (err) {
            console.error(
                "Status error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load application status"
            );
        } finally {
            setLoading(false);
        }
    };

    const submitApplication = async () => {
       

        setSubmitting(true);
        setMessage("");
        setError("");

        try {
            const response = await api.post(
                "/providers/submit"
            );

            console.log(
                "SUBMIT RESPONSE:",
                response.data
            );

            setMessage(
                response.data.message ||
                "Application submitted successfully"
            );

            setStatus("pending");

            await loadStatus();
        } catch (err) {
            console.error(
                "Submit error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to submit application"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-300">
                        Loading application status...
                    </p>
                </div>
            </>
        );
    }

    const statusStyles = {
        draft: {
            badge: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
            title: "Application Draft",
            description:
                "Complete your profile and upload the required documents before submitting.",
        },

        pending: {
            badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
            title: "Under Review",
            description:
                "Your application has been submitted and is currently being reviewed by the admin.",
        },

        approved: {
            badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
            title: "Application Approved",
            description:
                "Congratulations! Your service provider application has been approved.",
        },

        rejected: {
            badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
            title: "Application Rejected",
            description:
                "Your application was rejected. Review the admin remark, update your information, and submit again.",
        },
    };

    const currentStatus =
        statusStyles[status] ||
        statusStyles.draft;

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 transition-colors">

                <div className="max-w-4xl mx-auto px-4 sm:px-6">

                    {/* Header */}
                    <div className="mb-8">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/provider/dashboard"
                                )
                            }
                            className="mb-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            ← Back to Dashboard
                        </button>

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Application Status
                        </h1>

                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Track the progress of your ServiceHub application.
                        </p>

                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                            {message}
                        </div>
                    )}

                    {/* Current Status */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div>

                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Current Status
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                                    {currentStatus.title}
                                </h2>

                            </div>

                            <span
                                className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${currentStatus.badge}`}
                            >
                                {status}
                            </span>

                        </div>

                        <p className="mt-5 text-slate-600 dark:text-slate-300">
                            {currentStatus.description}
                        </p>

                    </div>

                    {/* Rejection Remark */}
                    {status === "rejected" &&
                        remark && (
                            <div className="mt-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">

                                <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">
                                    Admin Remark
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-400">
                                    {remark}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/provider/profile"
                                        )
                                    }
                                    className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition"
                                >
                                    Update Profile
                                </button>

                            </div>
                        )}

                    {/* Timeline */}
                    <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Application Timeline
                        </h2>

                        <div className="mt-6 space-y-6">

                            {/* Draft */}
                            <div className="flex gap-4">

                                <div className="w-3 h-3 mt-1.5 rounded-full bg-blue-600 shrink-0" />

                                <div>

                                    <h3 className="font-medium text-slate-900 dark:text-white">
                                        Profile Created
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Your ServiceHub provider profile has been created.
                                    </p>

                                </div>

                            </div>

                            {/* Submitted */}
                            <div className="flex gap-4">

                                <div
                                    className={`w-3 h-3 mt-1.5 rounded-full shrink-0 ${
                                        submittedAt
                                            ? "bg-blue-600"
                                            : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                                />

                                <div>

                                    <h3 className="font-medium text-slate-900 dark:text-white">
                                        Application Submitted
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {submittedAt
                                            ? formatDate(
                                                  submittedAt
                                              )
                                            : "Not submitted yet"}
                                    </p>

                                </div>

                            </div>

                            {/* Review */}
                            <div className="flex gap-4">

                                <div
                                    className={`w-3 h-3 mt-1.5 rounded-full shrink-0 ${
                                        reviewedAt
                                            ? "bg-blue-600"
                                            : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                                />

                                <div>

                                    <h3 className="font-medium text-slate-900 dark:text-white">
                                        Admin Review
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {reviewedAt
                                            ? formatDate(
                                                  reviewedAt
                                              )
                                            : status ===
                                              "pending"
                                            ? "Currently under review"
                                            : "Waiting for review"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Submit Application */}
                    {(status === "draft" ||
                        status === "rejected") && (
                        <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Submit Application
                            </h2>

                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Make sure your profile information and verification documents are complete before submitting.
                            </p>

                            <button
                                type="button"
                              onClick={() => setShowSubmitModal(true)}
                                disabled={submitting}
                                className="mt-5 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : status ===
                                      "rejected"
                                    ? "Resubmit Application"
                                    : "Submit Application"}
                            </button>

                        </div>
                    )}

                    {/* Pending Information */}
                    {status === "pending" && (
                        <div className="mt-6 rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-6">

                            <h2 className="font-semibold text-yellow-800 dark:text-yellow-300">
                                Application Under Review
                            </h2>

                            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                                Please wait while the administrator reviews your application.
                            </p>

                        </div>
                    )}

                    {/* Approved Information */}
                    {status === "approved" && (
                        <div className="mt-6 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6">

                            <h2 className="font-semibold text-green-800 dark:text-green-300">
                                Application Successfully Approved
                            </h2>

                            <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                                Your ServiceHub provider account is now approved.
                            </p>

                        </div>
                    )}

                </div>

            </main>
            {/* Submit Application Modal */}
{showSubmitModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-6">

            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
                    />
                </svg>
            </div>

            {/* Title */}
            <h2 className="mt-4 text-center text-xl font-bold text-slate-900 dark:text-white">
                Submit Application?
            </h2>

            {/* Message */}
            <p className="mt-3 text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
                Are you sure you want to submit your application for admin
                review?
            </p>

            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                Please make sure your profile and verification documents are
                complete before submitting.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">

                <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    disabled={submitting}
                    className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={submitApplication}
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? "Submitting..." : "Yes, Submit"}
                </button>

            </div>

        </div>
    </div>
)}
        </>
    );
};

export default Status;