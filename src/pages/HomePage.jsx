import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEye } from 'react-icons/fa';
import '../App.css';

function HomePage() {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;

    const fetchLocalMovies = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BASE_URL}/api/movies`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMovies(response.data);
        } catch (err) {
            console.error("Error fetching local movies:", err);
        }
    };

    useEffect(() => {
        fetchLocalMovies();
    }, []);

    const handleSearch = async (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        const token = localStorage.getItem('token');

        if (query.trim() === '') {
            fetchLocalMovies();
            return;
        }

        setIsSearching(true);

        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
            );
            const formattedMovies = response.data.results.map((movie) => ({
                _id: movie.id,
                title: movie.title,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
            }));
            setMovies(formattedMovies);
        } catch (err) {
            console.error("Error searching movies:", err);
            setMovies([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddToWatchlist = async (movie) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Token missing. Please log in again.');

        try {
            await axios.post(
                `${BASE_URL}/api/watchlist`,
                { title: movie.title, poster: movie.poster },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`${movie.title} added to watchlist!`);
        } catch (err) {
            console.error("Error adding to watchlist:", err);
            alert('Failed to add movie to watchlist.');
        }
    };

    const handleMarkAsWatched = async (movie) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Token missing. Please log in again.');

        try {
            await axios.post(
                `${BASE_URL}/api/watched`,
                { title: movie.title, poster: movie.poster },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`${movie.title} marked as watched!`);
        } catch (err) {
            console.error("Error marking as watched:", err);
            alert('Failed to mark movie as watched.');
        }
    };

    return (
        <div className="homepage">
            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search for a movie"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {isSearching && movies.length === 0 ? (
                <p>No movies found!</p>
            ) : (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <div className="movie-card" key={movie._id}>
                            {movie.poster ? (
                                <div className="poster-container">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title || 'Movie Poster'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/fallback.jpg'; // Optional fallback
                                        }}
                                    />
                                    <div className="button-overlay">
                                        <button
                                            className="icon-button add-to-watchlist"
                                            onClick={() => handleAddToWatchlist(movie)}
                                        >
                                            <FaPlus />
                                        </button>
                                        <button
                                            className="icon-button mark-as-watched"
                                            onClick={() => handleMarkAsWatched(movie)}
                                        >
                                            <FaEye />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>No image available</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
