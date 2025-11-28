// src/pages/Register.js
import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password) {
            setError('Username, email și parola sunt obligatorii');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Parola trebuie să aibă minim 6 caractere');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Parolele nu se potrivesc');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email invalid');
            return false;
        }

        if (formData.username.length < 3) {
            setError('Username-ul trebuie să aibă minim 3 caractere');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
        };

        const result = await register(userData);
        
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        
        setIsSubmitting(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container register-container">
                <div className="auth-header">
                    <Link to="/" className="logo-link">
                        <h1>ThoughtBox</h1>
                    </Link>
                    <h2>Alătură-te comunității!</h2>
                    <p>Creează-ți contul și începe să îți împărtășești gândurile</p>
                </div>

                <form className="auth-form-page" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Prenume</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Prenumele tău"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Nume</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Numele tău"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Alege un username unic"
                            required
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="adresa@email.com"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Parolă *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minim 6 caractere"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmă parola *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repetă parola"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="auth-submit-btn-page"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Se creează contul...' : 'Creează cont'}
                    </button>
                </form>

                <div className="auth-switch-page">
                    <p>Ai deja cont? 
                        <Link to="/login" className="switch-link">
                            Conectează-te aici
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

export default Register;
