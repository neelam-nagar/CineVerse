// src/pages/Home/Home.jsx
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import useMovieStore from "../../store/movieStore";
import SearchedMovies from "../../components/SearchedMovies";
import { Range } from "react-range";
import { animateScroll as scroll } from "react-scroll";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {
    trendingMovies,
    filteredMovies,
    genresList,
    selectedGenreName,
    startYear,
    endYear,
    loadingTrending,
    loadingFiltered,
    fetchTrendingMovies,
    setSelectedGenreByName,
    setStartYear,
    setEndYear,
    clearFilters,
    searchMovies,
    searchedMovies,
  } = useMovieStore();

  const navigate = useNavigate();

  const [displayCount, setDisplayCount] = useState(10); // number of movies to show
  const [searchQuery, setSearchQuery] = useState("");
  const [sliderValues, setSliderValues] = useState([startYear, endYear]);
  


  // initial trending load
  useEffect(() => {
    fetchTrendingMovies(10);
  }, []);

  // reset displayCount when filters change
  useEffect(() => {
    setDisplayCount(10);
  }, [selectedGenreName, startYear, endYear]);

  useEffect(() => {
    if (searchedMovies.length > 0) {
      scroll.scrollTo(530, {
        duration: 700,
        smooth: "easeInOutQuart",
      });
    }
    else {
      scroll.scrollTo(0, {
        duration: 700,
        smooth: "easeInOutQuart",
      });
    }
  }, [searchedMovies]);

  useEffect(() => {
    if (filteredMovies.length > 0) {
      scroll.scrollTo(950, {
        duration: 700,
        smooth: "easeInOutQuart",
      });
    }
  }, [filteredMovies]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMovies(searchQuery.trim());
    }
  };

  // derived flags
  const isFiltering = !!selectedGenreName;
  const isSearching = searchedMovies.length > 0;

  const currentYear = new Date().getFullYear();

  const STEP = 1;
  const MIN = 1950;
  const MAX = currentYear;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };

  return (

    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-40 py-12">
        {/* Hero */}
        <section
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center text-center p-8"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("https://picsum.photos/1200/600")',
          }}
        >
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
            Explore the World of Cinema
          </h1>
          <p className="text-gray-300 sm:text-lg">
            Discover, review, and analyze movies with CineVerse's AI-powered insights.
          </p>

          {/* Search (not wired here) */}
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }} className="w-full max-w-xl mt-6 relative">
            <input
              type="text"
              placeholder="Search for movies, actors, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-28 rounded-l-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="absolute top-0 right-0 h-14 px-6 bg-blue-500 text-white font-bold rounded-r-md hover:bg-blue-600">
              Search
            </button>
          </form>
        </section>

        {/* Show Search Results if searching */}
        {isSearching && <SearchedMovies />}

        {/* Trending (only show when not filtering) */}
        {!isFiltering && !isSearching && (
          <section className="py-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-2xl font-bold">Trending Now</h2>
            </div>

            <div className="flex overflow-x-auto gap-6 py-4 scrollbar-hide">
              {loadingTrending ? (
                <p className="text-gray-400">Loading trending movies...</p>
              ) : (
                trendingMovies.map((m) => (
                  <div key={m.id} className="flex flex-col min-w-[240px] gap-3 group">
                    <div
                      onClick={() => navigate(`/movies/${m.id}`)}
                      className="cursor-pointer w-full aspect-[2/3] bg-cover bg-center rounded-lg shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w500${m.poster_path})`,
                      }}
                    />
                    <p className="text-gray-200 font-semibold truncate">{m.title}</p>
                    <p className="text-gray-400 text-sm">{m.release_date?.split("-")[0]}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Genres */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Browse by Genre</h2>
            <div>
              <button
                onClick={clearFilters}
                className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 p-4">
            {genresList.map((g) => {
              const active = selectedGenreName === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenreByName(g)}
                  className={`h-10 px-5 rounded-full text-sm font-medium ${active ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </section>

        {/* Release Year Filter */}

        <section className="py-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Filter by Release Year</h2>
            <p className="text-gray-400 text-sm">
              {sliderValues[0]} — {sliderValues[1]}
            </p>

          </div>

          <div className="px-4 py-8 bg-gray-800 rounded-lg">
            <Range
              values={sliderValues}
              step={STEP}
              min={MIN}
              max={MAX}
              onChange={(values) => {
                // ✅ update only local slider
                setSliderValues(values);
              }}
              onFinalChange={(values) => {
                const [newStart, newEnd] = values;

                // ✅ push to store + trigger API
                setStartYear(newStart);
                setEndYear(newEnd);
                // call fetchFilteredMovies once here
                // fetchFilteredMovies(newStart, newEnd);
              }}
              renderTrack={({ props, children }) => (
                <div {...props} className="h-2 w-full rounded bg-gray-700 relative">
                  <div
                    className="absolute h-2 bg-blue-500 rounded"
                    style={{
                      left: `${((sliderValues[0] - MIN) / (MAX - MIN)) * 100}%`,
                      width: `${((sliderValues[1] - sliderValues[0]) / (MAX - MIN)) * 100}%`,
                    }}
                  />
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="h-5 w-5 bg-blue-500 rounded-full border-2 border-white shadow-md"
                />
              )}
            />

            <div className="flex justify-between text-gray-400 text-xs mt-2">
              <span>{MIN}</span>
              <span>{MAX}</span>
            </div>
          </div>
        </section>


        {/* Filtered Movies (shows when a genre is selected) */}
        {isFiltering && (
          <section className="py-12">
            <h2 className="text-white text-2xl font-bold mb-4">
              Results for {selectedGenreName} ({startYear} - {endYear})
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {loadingFiltered ? (
                <p className="text-gray-400">Loading...</p>
              ) : filteredMovies.length === 0 ? (
                <p className="text-gray-400">No movies found for this filter.</p>
              ) : (
                filteredMovies
                  .slice(0, displayCount)
                  .map((m) => (
                    <div key={m.id} className="flex flex-col gap-3 group">
                      <div
                        onClick={() => navigate(`/movies/${m.id}`)}
                        className="cursor-pointer w-full aspect-[2/3] bg-cover bg-center rounded-lg shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300"
                        style={{
                          backgroundImage: `url(https://image.tmdb.org/t/p/w500${m.poster_path})`,
                        }}
                      />
                      <p className="text-gray-200 font-semibold truncate">{m.title}</p>
                      <p className="text-gray-400 text-sm">
                        {m.release_date?.split("-")[0]}
                      </p>
                    </div>
                  ))
              )}
            </div>

            {/* Load More Button */}
            {displayCount < filteredMovies.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Load More
                </button>
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>

  );
};

export default Home;
