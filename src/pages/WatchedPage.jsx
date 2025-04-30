import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEyeSlash } from 'react-icons/fa';  // Importing React Icons for buttons
import '../App.css';  // Using your global styles

function WatchedPage() {
    const [watchedMovies, setWatchedMovies] = useState([]);

    useEffect(() => {
        const fetchWatchedMovies = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/watched', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWatchedMovies(res.data);
            } catch (err) {
                console.error("Error fetching watched movies:", err);
            }
        };
        fetchWatchedMovies();
    }, []);

    const handleRemove = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/watched/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchedMovies(prev => prev.filter(movie => movie._id !== id));
            alert("Movie removed from Watched list!");
        } catch (err) {
            console.error("Error removing movie:", err);
            alert("Failed to remove the movie.");
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
                                        <FaTrashAlt /> {/* React Icon for Trash */}
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
