// src/pages/Login.js
import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!formData.login || !formData.password) {
            setError('Toate câmpurile sunt obligatorii');
            setIsSubmitting(false);
            return;
        }

        const result = await login(formData.login, formData.password);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        
        setIsSubmitting(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="logo-link">
                        <h1>ThoughtBox</h1>
                    </Link>
                    <h2>Bun venit înapoi!</h2>
                    <p>Conectează-te pentru a-ți continua povestea</p>
                </div>

                <form className="auth-form-page" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="login">Username sau Email</label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            placeholder="Introdu username-ul sau email-ul"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Introdu parola"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-submit-btn-page"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Se conectează...' : 'Conectează-te'}
                    </button>
                </form>

                <div className="auth-switch-page">
                    <p>Nu ai cont încă? 
                        <Link to="/register" className="switch-link">
                            Înregistrează-te aici
                        </Link>
                    </p>
                </div>

                <div className="auth-footer">
                    <Link to="/" className="back-home">← Înapoi acasă</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
