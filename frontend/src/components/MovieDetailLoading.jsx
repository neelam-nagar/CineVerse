// src/components/MovieDetailLoading.jsx
import React from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"

const MovieDetailLoading = () => {
  return (
    <div>
      <Header></Header>
    <div className="px-40 py-12 bg-[#111418] min-h-screen animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster Placeholder */}
        <div className="md:col-span-1 bg-gray-700 rounded-lg h-[400px] w-full" />

        {/* Info Placeholder */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 w-3/4 bg-gray-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-600 rounded"></div>
          <div className="space-y-2 mt-4">
            <div className="h-4 w-1/3 bg-gray-600 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-600 rounded"></div>
          </div>
          <div className="h-24 w-full bg-gray-600 rounded mt-6"></div>
        </div>
      </div>

      {/* Reviews Placeholder */}
      <div className="mt-16 space-y-6">
        <div className="h-8 w-1/4 bg-gray-700 rounded"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4 p-6 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gray-600 rounded"></div>
                <div className="h-3 w-1/4 bg-gray-500 rounded"></div>
              </div>
            </div>
            <div className="h-4 w-full bg-gray-600 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default MovieDetailLoading;
