import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const Documents = () => {
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);
    const [profile, setProfile] = useState(null);

    const [documentType, setDocumentType] = useState("aadhaar");
    const [documentFile, setDocumentFile] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [loading, setLoading] = useState(true);
    const [uploadingDocument, setUploadingDocument] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [profileResponse, documentsResponse] =
                await Promise.all([
                    api.get("/providers/profile"),
                    api.get("/providers/documents"),
                ]);

            setProfile(
                profileResponse.data.profile ||
                profileResponse.data
            );

            setDocuments(
                documentsResponse.data.documents ||
                documentsResponse.data ||
                []
            );
        } catch (err) {
            console.error("Documents error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load documents"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentUpload = async (e) => {
        e.preventDefault();

        if (!documentFile) {
            setError("Please select a document.");
            return;
        }

        try {
            setUploadingDocument(true);
            setError("");
            setMessage("");

            const formData = new FormData();

            formData.append("type", documentType);
            formData.append("document", documentFile);

            const response = await api.post(
                "/providers/documents",
                formData
            );

            setMessage(
                response.data.message ||
                "Document uploaded successfully"
            );

            setDocumentFile(null);

            // Reset file input
            e.target.reset();

            await loadData();
        } catch (err) {
            console.error("Document upload error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to upload document"
            );
        } finally {
            setUploadingDocument(false);
        }
    };

    const handleProfilePhotoUpload = async (e) => {
        e.preventDefault();

        if (!profilePhoto) {
            setError("Please select a profile photo.");
            return;
        }

        try {
            setUploadingPhoto(true);
            setError("");
            setMessage("");

            const formData = new FormData();

            formData.append(
                "profilePhoto",
                profilePhoto
            );

            const response = await api.post(
                "/providers/documents/profile-photo",
                formData
            );

            setMessage(
                response.data.message ||
                "Profile photo uploaded successfully"
            );

            setProfilePhoto(null);

            e.target.reset();

            await loadData();
        } catch (err) {
            console.error(
                "Profile photo upload error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to upload profile photo"
            );
        } finally {
            setUploadingPhoto(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-300">
                        Loading documents...
                    </p>
                </div>
            </>
        );
    }

    const isApproved =
        profile?.status === "approved";

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 transition-colors">

                <div className="max-w-5xl mx-auto px-4 sm:px-6">

                    {/* Header */}
                    <div className="mb-8">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/provider/dashboard")
                            }
                            className="mb-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            ← Back to Dashboard
                        </button>

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Documents
                        </h1>

                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Upload your profile photo and verification documents.
                        </p>

                    </div>

                    {/* Approved Notice */}
                    {isApproved && (
                        <div className="mb-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-5 py-4">

                            <p className="font-semibold text-green-800 dark:text-green-300">
                                Your application has been approved.
                            </p>

                            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                                Document uploads are disabled for approved applications.
                            </p>

                        </div>
                    )}

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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Profile Photo */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Profile Photo
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Upload a JPG, JPEG or PNG image.
                            </p>

                            {/* Existing Photo */}
                            {profile?.profilePhoto && (
                                <div className="mt-5">

                                    <img
                                        src={`http://localhost:5000${profile.profilePhoto}`}
                                        alt="Profile"
                                        className="w-28 h-28 rounded-xl object-cover border border-slate-200 dark:border-slate-600"
                                    />

                                </div>
                            )}

                            {!isApproved && (
                                <form
                                    onSubmit={handleProfilePhotoUpload}
                                    className="mt-6"
                                >

                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={(e) =>
                                            setProfilePhoto(
                                                e.target.files?.[0] ||
                                                null
                                            )
                                        }
                                        className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900/40 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60"
                                    />

                                    <button
                                        type="submit"
                                        disabled={uploadingPhoto}
                                        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {uploadingPhoto
                                            ? "Uploading..."
                                            : "Upload Profile Photo"}
                                    </button>

                                </form>
                            )}

                        </div>

                        {/* Verification Document */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Verification Document
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Upload a document for verification.
                            </p>

                            {!isApproved && (
                                <form
                                    onSubmit={handleDocumentUpload}
                                    className="mt-6"
                                >

                                    {/* Type */}
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Document Type
                                    </label>

                                    <select
                                        value={documentType}
                                        onChange={(e) =>
                                            setDocumentType(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                                    >
                                        <option value="aadhaar">
                                            Aadhaar
                                        </option>

                                        <option value="pan">
                                            PAN
                                        </option>

                                        <option value="address_proof">
                                            Address Proof
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>
                                    </select>

                                    {/* File */}
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) =>
                                            setDocumentFile(
                                                e.target.files?.[0] ||
                                                null
                                            )
                                        }
                                        className="mt-4 block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900/40 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60"
                                    />

                                    <button
                                        type="submit"
                                        disabled={uploadingDocument}
                                        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {uploadingDocument
                                            ? "Uploading..."
                                            : "Upload Document"}
                                    </button>

                                </form>
                            )}

                        </div>

                    </div>

                    {/* Uploaded Documents */}
                    <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">

                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Uploaded Documents
                        </h2>

                        {documents.length === 0 ? (
                            <div className="mt-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No verification documents uploaded yet.
                                </p>

                            </div>
                        ) : (
                            <div className="mt-5 space-y-3">

                                {documents.map((document) => (
                                    <div
                                        key={document._id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-4"
                                    >

                                        <div>

                                            <p className="font-medium text-slate-900 dark:text-white capitalize">
                                                {document.type?.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                {document.fileName}
                                            </p>

                                        </div>

                                        <a
                                            href={`http://localhost:5000${document.filePath}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex justify-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 transition"
                                        >
                                            View Document
                                        </a>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </div>

            </main>
        </>
    );
};

export default Documents;