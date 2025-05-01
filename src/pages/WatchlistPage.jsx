import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEye } from 'react-icons/fa';
import '../App.css';

function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);
    const [watched, setWatched] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [watchlistRes, watchedRes] = await Promise.all([
                    axios.get('https://movie-backend-djdp.onrender.com/api/watchlist', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('https://movie-backend-djdp.onrender.com/api/watched', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setWatchlist(watchlistRes.data);
                setWatched(watchedRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleRemove = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://movie-backend-djdp.onrender.com/api/watchlist/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(prev => prev.filter(movie => movie._id !== id));
            alert("Removed from Watchlist!");
        } catch (err) {
            console.error("Error removing movie:", err);
        }
    };

    const handleMarkAsWatched = async (movie) => {
        if (watched.find(item => item.title === movie.title)) {
            alert("Already in Watched!");
            return;
        }
        

        const token = localStorage.getItem('token');
        try {
            await axios.post('https://movie-backend-djdp.onrender.com/api/watched', movie, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await axios.delete(`https://movie-backend-djdp.onrender.com/api/watchlist/${movie._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(prev => prev.filter(item => item._id !== movie._id));
            setWatched(prev => [...prev, movie]);
            alert("Marked as Watched!");
        } catch (err) {
            console.error("Error moving movie:", err);
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
                                    <button className="icon-button" onClick={() => handleRemove(movie._id)}>
                                        <FaTrashAlt />
                                    </button>
                                    <button className="icon-button" onClick={() => handleMarkAsWatched(movie)}>
                                        <FaEye />
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
