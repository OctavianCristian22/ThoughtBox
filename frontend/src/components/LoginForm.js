import { useState } from "react";
import { useAuth } from "./AuthContext";

function LoginForm({ onClose, onSwitchToRegister }) {
    const { login } = useAuth();
    const [ formData, setFormData ] = useState({
        login: '',
        password: ''
    });

    const [ error, setError ] = useState('');
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:value
        }));

        if(error) setError('');
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if(!formData.login || !formData.password) {
            setError('Toate campurile sunt obligatorii !');
            setIsSubmitting(false);
            return;
        }

        const result = await login(formData.login, formData.password);

        if(result.success) {
            onClose();
        } else {
            setError(result.error);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="auth-overlay">
            <div className="auth-modal">
                <div className="auth-header">
                    <h2>Conectează-te</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
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
                        className="auth-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Se conectează...' : 'Conectează-te'}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>Nu ai cont? 
                        <button 
                            type="button" 
                            className="switch-btn"
                            onClick={onSwitchToRegister}
                        >
                            Înregistrează-te
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
