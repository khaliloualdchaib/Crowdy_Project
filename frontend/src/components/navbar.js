import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

function Navigationbar() {
  const location = useLocation();
  const normalTab =
    "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
  const activeTab =
    "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px justify-center">
        <li className="me-2">
          <Link
            to="/"
            className={location.pathname === "/" ? activeTab : normalTab}
          >
            Graph
          </Link>
        </li>
        <li className="me-2">
          <Link
            to="/Cameras"
            className={location.pathname === "/Cameras" ? activeTab : normalTab}
          >
            Cameras
          </Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default Navigationbar;
