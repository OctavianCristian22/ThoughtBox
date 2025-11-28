import { useState } from 'react';
import { useAuth } from './AuthContext';

function PostForm({ onPostAdded }) {
    const { token, user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const postData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        const response = await fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            const newPost = await response.json();
            
            setFormData({
                title: '',
                content: '',
                tags: ''
            });
            setShowForm(false);
            
            if (onPostAdded) {
                onPostAdded(newPost);
            }
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Eroare la adăugarea postării');
        }
    } catch (error) {
        console.error('Eroare:', error);
        alert('Eroare la adăugarea postării');
    }

    setIsSubmitting(false);
};

    return (
        <div className="post-form-container">
            {!showForm ? (
                <div className="add-post-preview">
                    <button 
                        className="add-post-btn"
                        onClick={() => setShowForm(true)}
                    >
                    Ce gândești astăzi?
                    </button>
                </div>
            ) : (
                <form className="post-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <div className="user-info"> 
                            <span>Publici ca <strong>{user.firstName || user.username}</strong></span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Titlu:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Un titlu captivant pentru postarea ta..."
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Conținut:</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={8}
                            placeholder="Împărtășește-ți gândurile, ideile, experiențele..."
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tag-uri (opțional):</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="react, javascript, tutorial, experiență..."
                            disabled={isSubmitting}
                        />
                        <small className="form-help">Separate prin virgulă pentru organizare mai bună</small>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => {
                                setShowForm(false);
                                setFormData({ title: '', content: '', tags: '' });
                            }}
                            disabled={isSubmitting}
                        >
                            Anulează
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                        >
                            {isSubmitting ? 'Se publică...' : 'Publică postarea'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default PostForm;
