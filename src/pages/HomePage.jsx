import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEye } from 'react-icons/fa';
import '../App.css';

function HomePage() {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [watched, setWatched] = useState([]);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;

    // Fetch watchlist and watched on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchLists = async () => {
            try {
                const [watchlistRes, watchedRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/watchlist`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${BASE_URL}/api/watched`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setWatchlist(watchlistRes.data);
                setWatched(watchedRes.data);
            } catch (err) {
                console.error("Error fetching watchlist/watched:", err);
            }
        };
        fetchLists();
    }, []);

    useEffect(() => {
        fetchLocalMovies();
    }, []);

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
        if (watchlist.find(item => item.title === movie.title)) {
            alert("Movie already in Watchlist!");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return alert('Token missing. Please log in again.');

        try {
            await axios.post(`${BASE_URL}/api/watchlist`, movie, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatchlist(prev => [...prev, movie]);
            alert(`${movie.title} added to Watchlist!`);
        } catch (err) {
            console.error("Error adding to watchlist:", err);
        }
    };

    const handleMarkAsWatched = async (movie) => {
        if (watched.find(item => item.title === movie.title)) {
            alert("Already in Watched!");
            return;
        }
        

        const token = localStorage.getItem('token');
        if (!token) return alert('Token missing. Please log in again.');

        try {
            await axios.post(`${BASE_URL}/api/watched`, movie, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatched(prev => [...prev, movie]);
            alert(`${movie.title} marked as Watched!`);
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
                                        alt={movie.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/fallback.jpg';
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
