import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEyeSlash, FaPlus } from 'react-icons/fa'; // FaPlus for "Add to Watchlist"
import '../App.css';

function WatchedPage() {
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]); // Add this to track the watchlist

    useEffect(() => {
        const fetchWatchedMovies = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://movie-backend-djdp.onrender.com/api/watched', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWatchedMovies(res.data);
            } catch (err) {
                console.error("Error fetching watched movies:", err);
            }
        };

        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://movie-backend-djdp.onrender.com/api/watchlist', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWatchlist(res.data); // Fetch and set watchlist data
            } catch (err) {
                console.error("Error fetching watchlist:", err);
            }
        };

        fetchWatchedMovies();
        fetchWatchlist(); // Fetch watchlist when the component mounts
    }, []);

    const handleRemove = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://movie-backend-djdp.onrender.com/api/watched/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchedMovies(prev => prev.filter(movie => movie._id !== id));
            alert("Movie removed from Watched list!");
        } catch (err) {
            console.error("Error removing movie:", err);
            alert("Failed to remove the movie.");
        }
    };

    const handleAddToWatchlist = async (movie) => {
        // Check if movie is already in watchlist
        if (watchlist.find(item => item.title === movie.title)) {
            alert("Movie already in Watchlist!");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            // Add movie to watchlist
            await axios.post('https://movie-backend-djdp.onrender.com/api/watchlist', movie, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove movie from watched list
            await axios.delete(`https://movie-backend-djdp.onrender.com/api/watched/${movie._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state for watched movies
            setWatchedMovies(prev => prev.filter(item => item._id !== movie._id));

            // Update the local state for the watchlist
            setWatchlist(prev => [...prev, movie]); // Add the movie to the watchlist

            alert("Movie moved to Watchlist!");
        } catch (err) {
            console.error("Error moving movie to watchlist:", err);
            alert("Failed to move movie.");
        }
    };

    return (
        <div className="homepage">
            <h1>Watched</h1>
            {watchedMovies.length === 0 ? (
                <p>No movies in your watched list!</p>
            ) : (
                <div className="movie-grid">
                    {watchedMovies.map(movie => (
                        <div className="movie-card" key={movie._id}>
                            <div className="poster-container">
                                {movie.poster && <img src={movie.poster} alt={movie.title} />}
                                <div className="button-overlay">
                                    <button
                                        className="icon-btn remove-btn"
                                        onClick={() => handleRemove(movie._id)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                    <button
                                        className="icon-btn"
                                        onClick={() => handleAddToWatchlist(movie)}
                                    >
                                        <FaPlus /> {/* Add to Watchlist */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WatchedPage;
