import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

function ProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [rejecting, setRejecting] = useState(false);
  const [remark, setRemark] = useState("");
  const [processing, setProcessing] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadProvider();
  }, [id]);

  const loadProvider = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/admin/providers/${id}`);

      setProvider(response.data.provider);
      setDocuments(response.data.documents || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load provider details"
      );
    } finally {
      setLoading(false);
    }
  };

  const approveProvider = async () => {
    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const response = await api.patch(
        `/admin/providers/${id}/approve`
      );

      setMessage(
        response.data.message ||
          "Provider approved successfully"
      );

      setShowApproveModal(false);

      await loadProvider();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to approve provider"
      );
    } finally {
      setProcessing(false);
    }
  };

  const rejectProvider = async () => {
    if (!remark.trim()) {
      setError("Please enter a rejection remark.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setMessage("");

      const response = await api.patch(
        `/admin/providers/${id}/reject`,
        {
          rejectionRemark: remark.trim(),
        }
      );

      setMessage(
        response.data.message ||
          "Provider rejected successfully"
      );

      setShowRejectModal(false);
      setRemark("");

      await loadProvider();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reject provider"
      );
    } finally {
      setProcessing(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const getDocumentName = (type) => {
    const names = {
      aadhaar: "Aadhaar",
      pan: "PAN",
      address_proof: "Address Proof",
      other: "Other",
    };

    return names[type] || type;
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return "#";

    if (filePath.startsWith("http")) {
      return filePath;
    }

    return `${filePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <Navbar />

        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin"></div>

            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Loading provider details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6">
            <p className="text-red-600 dark:text-red-400">
              Provider not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
    Supports both possible backend structures:
    provider.user
    provider.userId
  */
  const user = provider.user || provider.userId || {};

  const isPending = provider.status === "pending";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3 transition"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Provider Details
              </h1>

              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Review provider application and documents.
              </p>
            </div>

            <span
              className={`self-start px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                provider.status
              )}`}
            >
              {provider.status}
            </span>

          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-green-700 dark:text-green-400">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <InfoItem
                  label="Name"
                  value={user.name}
                />

                <InfoItem
                  label="Email"
                  value={user.email}
                />

                <InfoItem
                  label="Phone"
                  value={provider.phone}
                />

                <InfoItem
                  label="Experience"
                  value={`${provider.experience || 0} years`}
                />

              </div>
            </div>

            {/* Services */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-5">
                Services & Skills
              </h2>

              <div className="mb-5">

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Service Categories
                </p>

                <div className="flex flex-wrap gap-2">

                  {provider.categories?.length > 0 ? (
                    provider.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm"
                      >
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">
                      No categories
                    </span>
                  )}

                </div>
              </div>

              <div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Skills
                </p>

                <div className="flex flex-wrap gap-2">

                  {provider.skills?.length > 0 ? (
                    provider.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">
                      No skills
                    </span>
                  )}

                </div>
              </div>

            </div>

            {/* Location */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-5">
                Service Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                <InfoItem
                  label="City"
                  value={provider.location?.city}
                />

                <InfoItem
                  label="State"
                  value={provider.location?.state}
                />

                <InfoItem
                  label="Pincode"
                  value={provider.location?.pincode}
                />

              </div>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-5">
                Verification Documents
              </h2>

              {documents.length === 0 ? (

                <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center text-slate-500 dark:text-slate-400">
                  No documents uploaded.
                </div>

              ) : (

                <div className="space-y-3">

                  {documents.map((document) => (

                    <div
                      key={document._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-200 dark:border-slate-700 rounded-xl p-4"
                    >

                      <div>

                        <p className="font-medium text-slate-900 dark:text-white">
                          {getDocumentName(document.type)}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {document.fileName}
                        </p>

                      </div>

                      <a
                        href={getFileUrl(document.filePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-medium transition"
                      >
                        View Document
                      </a>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Profile Photo */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-5">
                Profile Photo
              </h2>

              {provider.profilePhoto ? (

                <img
                  src={getFileUrl(provider.profilePhoto)}
                  alt="Provider"
                  className="w-full aspect-square object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                />

              ) : (

                <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  No photo uploaded
                </div>

              )}

            </div>

            {/* Application */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-5">
                Application
              </h2>

              <div className="space-y-4">

                <InfoItem
                  label="Status"
                  value={provider.status}
                  capitalize
                />

                <InfoItem
                  label="Submitted"
                  value={
                    provider.submittedAt
                      ? new Date(
                          provider.submittedAt
                        ).toLocaleString()
                      : "Not submitted"
                  }
                />

                <InfoItem
                  label="Reviewed"
                  value={
                    provider.reviewedAt
                      ? new Date(
                          provider.reviewedAt
                        ).toLocaleString()
                      : "Not reviewed"
                  }
                />

              </div>

            </div>

            {/* Actions */}
            {isPending && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 transition-colors">

                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-5">
                  Review Application
                </h2>

                <button
                  onClick={() =>
                    setShowApproveModal(true)
                  }
                  disabled={processing}
                  className="w-full py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-green-400 transition"
                >
                  ✓ Approve Provider
                </button>

                <button
                  onClick={() => {
                    setShowRejectModal(true);
                    setError("");
                  }}
                  disabled={processing}
                  className="w-full mt-3 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:bg-red-400 transition"
                >
                  ✕ Reject Provider
                </button>

                {rejecting && (
                  <div className="mt-4">

                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Rejection Remark
                    </label>

                    <textarea
                      value={remark}
                      onChange={(e) =>
                        setRemark(e.target.value)
                      }
                      rows="4"
                      placeholder="Explain why the application is rejected..."
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-red-500"
                    />

                    <button
                      onClick={rejectProvider}
                      disabled={processing}
                      className="w-full mt-3 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 disabled:bg-slate-400 transition"
                    >
                      Confirm Rejection
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4">

            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Reject Provider
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Provide a reason for rejecting this application.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowRejectModal(false)
                  }
                  disabled={processing}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 text-xl transition"
                >
                  ×
                </button>

              </div>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Rejection Remark
              </label>

              <textarea
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
                  setError("");
                }}
                rows="5"
                placeholder="Example: Please upload a valid address proof."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-red-500"
              />

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                This remark will be visible to the provider.
              </p>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRemark("");
                  }}
                  disabled={processing}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={rejectProvider}
                  disabled={
                    processing || !remark.trim()
                  }
                  className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:bg-red-300 transition"
                >
                  {processing
                    ? "Rejecting..."
                    : "Confirm Rejection"}
                </button>

              </div>

            </div>

          </div>
        )}

        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-6">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Approve Provider
                </h2>

                <button
                  onClick={() =>
                    setShowApproveModal(false)
                  }
                  disabled={processing}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 text-xl transition"
                >
                  ×
                </button>

              </div>

              <p className="text-slate-600 dark:text-slate-300">
                Are you sure you want to approve{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.name || "this provider"}
                </span>
                ?
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Once approved, the provider will no longer be able to
                edit their profile or upload documents.
              </p>

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    setShowApproveModal(false)
                  }
                  disabled={processing}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={approveProvider}
                  disabled={processing}
                  className="flex-1 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-green-400 transition"
                >
                  {processing
                    ? "Approving..."
                    : "Confirm Approval"}
                </button>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

function InfoItem({
  label,
  value,
  capitalize = false,
}) {
  return (
    <div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 font-medium text-slate-900 dark:text-white ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value || "Not provided"}
      </p>

    </div>
  );
}

export default ProviderDetails;