import React from "react";
import useMovieStore from "../store/movieStore";
import { useNavigate } from "react-router-dom";

const SearchedMovies = () => {
    const { searchedMovies, loadingSearch, clearSearch } = useMovieStore();
    const navigate = useNavigate();

    if (loadingSearch) {
        return <p className="text-gray-400">Searching...</p>;
    }

    if (searchedMovies.length === 0) {
        return <p className="text-gray-400">No movies found.</p>;
    }

    return (

        <section className="py-12">
            <div className="flex justify-between mb-4">
                <h2 className="text-white text-2xl font-bold">Search Results</h2>
                <button
                    onClick={clearSearch}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm rounded-md"
                >
                    Clear Search
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {searchedMovies.map((m) => (
                    <div key={m.id} className="flex flex-col gap-3 group">
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
                ))}
            </div>
        </section>
    );
};

export default SearchedMovies;
