import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <a className="text-gray-600 hover:text-blue-600 text-base font-normal dark:text-gray-300 dark:hover:text-blue-400" href="#">
            About
          </a>
          <a className="text-gray-600 hover:text-blue-600 text-base font-normal dark:text-gray-300 dark:hover:text-blue-400" href="#">
            Contact
          </a>
          <a className="text-gray-600 hover:text-blue-600 text-base font-normal dark:text-gray-300 dark:hover:text-blue-400" href="#">
            Privacy Policy
          </a>
          <a className="text-gray-600 hover:text-blue-600 text-base font-normal dark:text-gray-300 dark:hover:text-blue-400" href="#">
            Terms of Service
          </a>
        </nav>
        <p className="text-center text-base text-gray-500 dark:text-gray-400">
          © 2024 CineVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
