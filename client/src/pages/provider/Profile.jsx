import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Cleaning",
    "AC & Appliance Repair",
    "Painting",
    "Vehicle Repair & Service",
    "Computer & IT Services",
    "Mobile & Electronics Repair",
    "Gardening & Landscaping",
];

const Profile = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        phone: "",
        categories: [],
        skills: [],
        experience: "",
        location: {
            city: "",
            state: "",
            pincode: "",
        },
    });

    const [categoryInput, setCategoryInput] = useState("");
    const [skillInput, setSkillInput] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [status, setStatus] = useState("draft");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/providers/profile");

            const profile =
                response.data.profile ||
                response.data;

            setForm({
                phone: profile.phone || "",
                categories: profile.categories || [],
                skills: profile.skills || [],
                experience:
                    profile.experience !== undefined &&
                    profile.experience !== null
                        ? profile.experience
                        : "",
                location: {
                    city: profile.location?.city || "",
                    state: profile.location?.state || "",
                    pincode: profile.location?.pincode || "",
                },
            });

            setStatus(profile.status || "draft");
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            location: {
                ...previous.location,
                [name]: value,
            },
        }));
    };

    const addCategory = () => {
        const value = categoryInput;

        if (!value) return;

        if (form.categories.includes(value)) {
            setCategoryInput("");
            return;
        }

        setForm((previous) => ({
            ...previous,
            categories: [
                ...previous.categories,
                value,
            ],
        }));

        setCategoryInput("");
    };

    const removeCategory = (category) => {
        setForm((previous) => ({
            ...previous,
            categories: previous.categories.filter(
                (item) => item !== category
            ),
        }));
    };

    const addSkill = () => {
        const value = skillInput.trim();

        if (!value) return;

        if (form.skills.includes(value)) {
            setSkillInput("");
            return;
        }

        setForm((previous) => ({
            ...previous,
            skills: [
                ...previous.skills,
                value,
            ],
        }));

        setSkillInput("");
    };

    const removeSkill = (skill) => {
        setForm((previous) => ({
            ...previous,
            skills: previous.skills.filter(
                (item) => item !== skill
            ),
        }));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setSaving(true);

        try {
            const response = await api.put(
                "/providers/profile",
                {
                    phone: form.phone,
                    categories: form.categories,
                    skills: form.skills,
                    experience: form.experience,
                    location: form.location,
                }
            );

            setMessage(
                response.data.message ||
                "Profile updated successfully"
            );

            await loadProfile();
        } catch (err) {
            console.error("Update profile error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-300">
                        Loading profile...
                    </p>
                </div>
            </>
        );
    }

    const isApproved = status === "approved";

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
                                navigate("/provider/dashboard")
                            }
                            className="mb-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                            ← Back to Dashboard
                        </button>

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            My Profile
                        </h1>

                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Manage your professional information.
                        </p>

                    </div>

                    {/* Approved Notice */}
                    {isApproved && (
                        <div className="mb-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-5 py-4">

                            <p className="font-semibold text-green-800 dark:text-green-300">
                                Your application has been approved.
                            </p>

                            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                                Your profile is now read-only.
                            </p>

                        </div>
                    )}

                    {/* Rejected Notice */}
                    {status === "rejected" && (
                        <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-5 py-4">

                            <p className="font-semibold text-red-800 dark:text-red-300">
                                Your application was rejected.
                            </p>

                            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                                Please update your profile and submit again.
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

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8"
                    >

                        {/* Contact Information */}
                        <section>

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Contact Information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Provide your contact details.
                            </p>

                            <div className="mt-6">

                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    disabled={isApproved}
                                    placeholder="Enter your phone number"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-slate-100 dark:disabled:bg-slate-700/60 disabled:cursor-not-allowed"
                                />

                            </div>

                        </section>

                        <div className="my-8 border-t border-slate-200 dark:border-slate-700" />

                        {/* Service Categories */}
                        <section>

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Service Categories
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Select the services you provide.
                            </p>

                            {!isApproved && (
                                <div className="mt-6 flex gap-3">

                                    <select
                                        value={categoryInput}
                                        onChange={(e) =>
                                            setCategoryInput(e.target.value)
                                        }
                                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                                    >
                                        <option value="">
                                            Select a service category
                                        </option>

                                        {serviceCategories
                                            .filter(
                                                (category) =>
                                                    !form.categories.includes(category)
                                            )
                                            .map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={addCategory}
                                        disabled={!categoryInput}
                                        className="px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add
                                    </button>

                                </div>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">

                                {form.categories.length === 0 ? (
                                    <p className="text-sm text-slate-400 dark:text-slate-500">
                                        No categories added yet.
                                    </p>
                                ) : (
                                    form.categories.map((category) => (
                                        <span
                                            key={category}
                                            className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300"
                                        >
                                            {category}

                                            {!isApproved && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCategory(category)
                                                    }
                                                    className="text-blue-500 dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </span>
                                    ))
                                )}

                            </div>

                        </section>

                        <div className="my-8 border-t border-slate-200 dark:border-slate-700" />

                        {/* Skills */}
                        <section>

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Skills
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Add your professional skills.
                            </p>

                            {!isApproved && (
                                <div className="mt-6 flex gap-3">

                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) =>
                                            setSkillInput(e.target.value)
                                        }
                                        onKeyDown={handleSkillKeyDown}
                                        placeholder="e.g. Pipe Fitting"
                                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                                    />

                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                                    >
                                        Add
                                    </button>

                                </div>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">

                                {form.skills.length === 0 ? (
                                    <p className="text-sm text-slate-400 dark:text-slate-500">
                                        No skills added yet.
                                    </p>
                                ) : (
                                    form.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200"
                                        >
                                            {skill}

                                            {!isApproved && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(skill)
                                                    }
                                                    className="text-slate-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </span>
                                    ))
                                )}

                            </div>

                        </section>

                        <div className="my-8 border-t border-slate-200 dark:border-slate-700" />

                        {/* Experience */}
                        <section>

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Experience
                            </h2>

                            <div className="mt-6 max-w-xs">

                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Years of Experience
                                </label>

                                <input
                                    type="number"
                                    name="experience"
                                    min="0"
                                    value={form.experience}
                                    onChange={handleChange}
                                    disabled={isApproved}
                                    placeholder="e.g. 3"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-slate-100 dark:disabled:bg-slate-700/60 disabled:cursor-not-allowed"
                                />

                            </div>

                        </section>

                        <div className="my-8 border-t border-slate-200 dark:border-slate-700" />

                        {/* Location */}
                        <section>

                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                Service Location
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Enter the location where you provide services.
                            </p>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={form.location.city}
                                        onChange={handleLocationChange}
                                        disabled={isApproved}
                                        placeholder="Hyderabad"
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-slate-100 dark:disabled:bg-slate-700/60 disabled:cursor-not-allowed"
                                    />

                                </div>

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={form.location.state}
                                        onChange={handleLocationChange}
                                        disabled={isApproved}
                                        placeholder="Telangana"
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-slate-100 dark:disabled:bg-slate-700/60 disabled:cursor-not-allowed"
                                    />

                                </div>

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        value={form.location.pincode}
                                        onChange={handleLocationChange}
                                        disabled={isApproved}
                                        placeholder="500001"
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-slate-100 dark:disabled:bg-slate-700/60 disabled:cursor-not-allowed"
                                    />

                                </div>

                            </div>

                        </section>

                        {/* Save */}
                        {!isApproved && (
                            <div className="mt-8 flex justify-end">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Profile"}
                                </button>

                            </div>
                        )}

                    </form>

                </div>

            </main>
        </>
    );
};

export default Profile;