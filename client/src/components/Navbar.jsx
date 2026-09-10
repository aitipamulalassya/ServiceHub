import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() =>
              navigate(
                isAdmin
                  ? "/admin/dashboard"
                  : "/provider/dashboard"
              )
            }
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              S
            </div>

            <span className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-200">
              ServiceHub
            </span>
          </button>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition"
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* User Info */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors duration-200">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
                {isAdmin
                  ? "Administrator"
                  : "Service Provider"}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;