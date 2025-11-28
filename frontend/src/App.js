import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Se încarcă...</p>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Se încarcă...</p>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/" /> : children;
}

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                
                <Route 
                    path="/login" 
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } 
                />
                <Route 
                    path="/register" 
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    } 
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
