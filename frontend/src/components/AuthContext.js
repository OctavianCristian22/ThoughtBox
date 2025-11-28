import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within AuthProvider!");
    }

    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ token, setToken ] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if(token) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, [token]);

const checkAuth = async () => {
    try {
        console.log('Checking auth with token:', token); // DEBUG
        const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Auth check response status:', response.status); // DEBUG

        if (response.ok) {
            const data = await response.json();
            console.log('Auth check data:', data); // DEBUG
            setUser(data.user);
        } else {
            console.log('Auth check failed, removing token'); // DEBUG
            localStorage.removeItem('token');
            setToken(null);
        }
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setToken(null);
    }
    setLoading(false);
};

    const login = async (loginData, password) => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: loginData, password })
        });

        const data = await response.json();
        console.log('Login response data:', data); // DEBUG

        if (response.ok) {
            console.log('Saving token:', data.token); // DEBUG
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: 'Eroare de conexiune' };
    }
};

    const register = async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if(response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUser(data.user);
                return { success:true };
            } else {
                return { success: false, error:data.error };
            }
        } catch (error) {
            return { success: false, error: 'Eroare de conexiune' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
