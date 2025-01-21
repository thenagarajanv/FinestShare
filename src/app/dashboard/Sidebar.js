import { useState, useEffect } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarProductMenuOpen, setSidebarProductMenuOpen] = useState(false);

  useEffect(() => {
    const storedMenuState = window.localStorage.getItem('sidebarProductMenuOpen');
    if (storedMenuState === 'open') {
      setSidebarProductMenuOpen(true);
    } else {
      setSidebarProductMenuOpen(false);
      window.localStorage.setItem('sidebarProductMenuOpen', 'close');
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarProductMenu = () => {
    const newState = !sidebarProductMenuOpen;
    setSidebarProductMenuOpen(newState);
    window.localStorage.setItem('sidebarProductMenuOpen', newState ? 'open' : 'close');
  };

  return (
    <div className="relative flex items-start">
      <div className="fixed top-0 z-40 transition-all duration-300">
        <div className="flex justify-end">
          <button
            onClick={toggleSidebar}
            className={`transition-all duration-300 w-8 p-1 mx-3 my-2 rounded-full focus:outline-none ${
              sidebarOpen ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
            }`}
          >
            <svg
              viewBox="0 0 20 20"
              className={`w-6 h-6 fill-current ${
                sidebarOpen ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {sidebarOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 bottom-0 left-0 z-30 h-full bg-gray-900 text-gray-400 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? 'w-56' : 'w-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 px-8 py-3 text-center">
            <Link href="#">
              <a className="text-lg text-gray-200">My App</a>
            </Link>
          </div>
          <nav>
            <div className={`overflow-hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              <Link href="#">
                <a className="flex items-center px-4 py-3 hover:bg-gray-800">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 1200 1200">
                    <path d="M600 195.373c-331.371 0-600 268.629-600 600c0 73.594 13.256 144.104 37.5 209.253h164.062C168.665 942.111 150 870.923 150 795.373c0-248.528 201.471-450 450-450s450 201.472 450 450c0 75.55-18.665 146.738-51.562 209.253H1162.5c24.244-65.148 37.5-135.659 37.5-209.253c0-331.371-268.629-600-600-600zm0 235.62c-41.421 0-75 33.579-75 75c0 41.422 33.579 75 75 75s75-33.578 75-75c0-41.421-33.579-75-75-75zm-224.927 73.462c-41.421 0-75 33.579-75 75c0 41.422 33.579 75 75 75s75-33.578 75-75c0-41.421-33.579-75-75-75zm449.854 0c-41.422 0-75 33.579-75 75c0 41.422 33.578 75 75 75c41.421 0 75-33.578 75-75c0-41.421-33.579-75-75-75zM600 651.672l-58.813 294.141v58.814h117.627v-58.814L600 651.672z" />
                  </svg>
                  <span className="mx-4">Dashboard</span>
                </a>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <div
        className={`flex-col w-full transition-all duration-300 ${
          sidebarOpen ? 'ml-56' : 'ml-0'
        }`}
      >
        <div className="p-10">Content Goes Here</div>
      </div>
    </div>
  );
};

export default Sidebar;
