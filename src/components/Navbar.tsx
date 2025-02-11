import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useStore";

const Navbar: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user from store
    setUser(null);
    // Navigate to your sign-in / sign-up page
    navigate("/");
  };

  return (
    <nav className="bg-emerald-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src="/logo.png" alt="Greyden Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-bold">
            <NavLink to="/">GREYDEN</NavLink>
          </h1>
        </div>

        {/* Nav Links (only if user is logged in) */}
        <ul className="flex space-x-6">
          {user && (
            <>
              <li>
                <NavLink
                  to="/Home"
                  className={({ isActive }) =>
                    `hover:text-black ${isActive ? "text-black font-bold" : ""}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `hover:text-black ${isActive ? "text-black font-bold" : ""}`
                  }
                >
                  History
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/inventory"
                  className={({ isActive }) =>
                    `hover:text-black ${isActive ? "text-black font-bold" : ""}`
                  }
                >
                  Inventory
                </NavLink>
              </li>

              {/* Logout Button */}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
