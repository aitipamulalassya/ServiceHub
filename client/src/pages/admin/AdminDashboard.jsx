import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProviders: 0,
    pendingProviders: 0,
    approvedProviders: 0,
    rejectedProviders: 0,
    draftProviders: 0,
  });

  const [providers, setProviders] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProviders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadProviders();
  }, [page, status]);

  const loadStats = async () => {
    try {
      const response = await api.get("/admin/stats");

      setStats(
        response.data.statistics || {
          totalProviders: 0,
          pendingProviders: 0,
          approvedProviders: 0,
          rejectedProviders: 0,
          draftProviders: 0,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard statistics"
      );
    }
  };

  const loadProviders = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      const response = await api.get("/admin/providers", {
        params,
      });

      setProviders(response.data.providers || []);

      setPagination(
        response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalProviders: 0,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load providers"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProviders();
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const getStatusStyle = (providerStatus) => {
    switch (providerStatus) {
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and review service provider applications.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          <StatCard
            title="Total Providers"
            value={stats.totalProviders}
            icon="👥"
          />

          <StatCard
            title="Pending"
            value={stats.pendingProviders}
            icon="⏳"
          />

          <StatCard
            title="Approved"
            value={stats.approvedProviders}
            icon="✓"
          />

          <StatCard
            title="Rejected"
            value={stats.rejectedProviders}
            icon="✕"
          />

          <StatCard
            title="Draft"
            value={stats.draftProviders}
            icon="📝"
          />

        </div>

        {/* Providers */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">

          {/* Table Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Service Providers
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Review provider applications.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">

                <form
                  onSubmit={handleSearch}
                  className="flex"
                >
                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search provider..."
                    className="w-full sm:w-64 rounded-l-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
                  >
                    Search
                  </button>
                </form>

                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Clear
                </button>

              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">

            {loading ? (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                Loading providers...
              </div>
            ) : providers.length === 0 ? (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                No providers found.
              </div>
            ) : (
              <table className="w-full text-left">

                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">

                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Provider
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Location
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">

                  {providers.map((provider) => {

                    const user = provider.userId || {};

                    return (
                      <tr
                        key={provider._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                      >

                        <td className="px-6 py-4">

                          <div className="font-medium text-slate-900 dark:text-white">
                            {user.name || "N/A"}
                          </div>

                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            ID: {provider._id}
                          </div>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {user.email || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {provider.location?.city || "N/A"}

                          {provider.location?.state
                            ? `, ${provider.location.state}`
                            : ""}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                              provider.status
                            )}`}
                          >
                            {provider.status}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/providers/${provider._id}`
                              )
                            }
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                          >
                            View Details →
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>
            )}

          </div>

          {/* Pagination */}
          {!loading && providers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-700">

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page {pagination.currentPage} of{" "}
                {pagination.totalPages}
              </p>

              <div className="flex gap-2">

                <button
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((prev) => prev - 1)
                  }
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  ← Previous
                </button>

                <button
                  disabled={
                    page >= pagination.totalPages
                  }
                  onClick={() =>
                    setPage((prev) => prev + 1)
                  }
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Next →
                </button>

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {value}
          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;