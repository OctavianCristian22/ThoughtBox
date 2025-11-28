import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import { useAuth } from '../components/AuthContext';

function Home() {
    const [message, setMessage] = useState('');
    const [refreshPosts, setRefreshPosts] = useState(0);
    const { isAuthenticated, user, logout, loading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef=useRef(null);

    const testBackend = async () => {
        try {
            const response = await fetch('/api/test');
            const data = await response.json();
            setMessage(data.message);
            console.log("Răspuns de la backend:", data);
        } catch (error) {
            console.error("Eroare: ", error);
            setMessage("Eroare la conectare");
        }
    };

    const handlePostAdded = () => {
        setRefreshPosts(prev => prev + 1);
    };
     
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) {
        return (
            <div className="App">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Se încarcă...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>ThoughtBox</h1>
                        <p>Where thoughts matter.</p>
                    </div>
                    <div className="header-right">
                        {isAuthenticated ? (
                            <div className="user-menu">
                                <div className="user-info">
                                    <div className={`user-avatar ${isMenuOpen ? "open" : "closed"}`} onClick={toggleMenu}>
                                    </div>
                                    {isMenuOpen && (
                                        <ul className={`dropdown-menu ${isMenuOpen ? "open" : "closed"}`} ref={menuRef}>
                                            <li>Profil</li>
                                            <li>Postări</li>
                                        </ul>
                                    )}
                                    <span className="user-name">
                                        Salut, {user.firstName || user.username}!
                                    </span>
                                </div>
                                <button onClick={logout} className="logout-btn">
                                    Deconectează-te
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="auth-btn login-btn">
                                    Conectează-te
                                </Link>
                                <Link to="/register" className="auth-btn register-btn">
                                    Înregistrează-te
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            
            <main>
                {isAuthenticated && (
                    <div className="welcome-section">
                        <p>Bun venit înapoi, <strong>{user.firstName || user.username}</strong>!</p>
                    </div>
                )}

                {isAuthenticated && <PostForm onPostAdded={handlePostAdded} />}

                <PostList key={refreshPosts} />
                
                <div className="test-section">
                    <button onClick={testBackend}>Test Backend</button>
                    {message && <p>Mesaj de la server: {message}</p>}
                </div>

                {!isAuthenticated && (
                    <div className="cta-section">
                        <h3>Vrei să-ți împărtășești gândurile?</h3>
                        <p>Înregistrează-te pentru a putea scrie și publica propriile postări!</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="cta-btn primary">
                                Înregistrează-te acum
                            </Link>
                            <Link to="/login" className="cta-btn secondary">
                                Am deja cont
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;
