import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEye } from 'react-icons/fa';  // Importing React Icons
import '../App.css';  // Using your global styles

function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://movie-backend-djdp.onrender.com/api/watchlist', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWatchlist(res.data);
            } catch (err) {
                console.error("Error fetching watchlist:", err);
            }
        };
        fetchWatchlist();
    }, []);

    const handleRemove = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://movie-backend-djdp.onrender.com/api/watchlist/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(prev => prev.filter(movie => movie._id !== id));
            alert("Movie removed from Watchlist!");
        } catch (err) {
            console.error("Error removing movie:", err);
            alert("Failed to remove the movie.");
        }
    };

    const handleMarkAsWatched = async (movie) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/watched', movie, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await axios.delete(`http://localhost:5000/api/watchlist/${movie._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(prev => prev.filter(item => item._id !== movie._id));
            alert("Movie marked as Watched!");
        } catch (err) {
            console.error("Error moving movie to watched:", err);
            alert("Failed to mark as Watched.");
        }
    };

    return (
        <div className="homepage">
            <h1>Watchlist</h1>
            {watchlist.length === 0 ? (
                <p>No movies in your watchlist!</p>
            ) : (
                <div className="movie-grid">
                    {watchlist.map(movie => (
                        <div className="movie-card" key={movie._id}>
                            <div className="poster-container">
                                {movie.poster && <img src={movie.poster} alt={movie.title} />}
                                <div className="button-overlay">
                                    <button
                                        className="icon-button"
                                        onClick={() => handleRemove(movie._id)}
                                    >
                                        <FaTrashAlt /> {/* React Icon for Trash */}
                                    </button>
                                    <button
                                        className="icon-button"
                                        onClick={() => handleMarkAsWatched(movie)}
                                    >
                                        <FaEye /> {/* React Icon for Eye */}
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

export default WatchlistPage;
