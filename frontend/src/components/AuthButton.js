import { useState } from 'react';
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthButton() {
    const { user, logout, isAuthenticated } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSwitchToRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const handleSwitchToLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    const closeModals = () => {
        setShowLogin(false);
        setShowRegister(false);
    };

    if (isAuthenticated) {
        return (
            <div className="auth-user-menu">
                <button 
                    className="user-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    <span className="user-avatar">
                        {user.firstName?.[0] || user.username[0].toUpperCase()}
                    </span>
                    <span className="user-name">
                        {user.firstName || user.username}
                    </span>
                </button>

                {showUserMenu && (
                    <div className="user-dropdown">
                        <div className="user-info">
                            <p><strong>{user.firstName} {user.lastName}</strong></p>
                            <p className="user-email">@{user.username}</p>
                        </div>
                        <hr />
                        <button onClick={logout} className="logout-btn">
                            Deconectează-te
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="auth-buttons">
                <button 
                    className="auth-btn login-btn"
                    onClick={() => setShowLogin(true)}
                >
                    Conectează-te
                </button>
                <button 
                    className="auth-btn register-btn"
                    onClick={() => setShowRegister(true)}
                >
                    Înregistrează-te
                </button>
            </div>

            {showLogin && (
                <LoginForm 
                    onClose={closeModals}
                    onSwitchToRegister={handleSwitchToRegister}
                />
            )}

            {showRegister && (
                <RegisterForm 
                    onClose={closeModals}
                    onSwitchToLogin={handleSwitchToLogin}
                />
            )}
        </>
    );
}

export default AuthButton;
