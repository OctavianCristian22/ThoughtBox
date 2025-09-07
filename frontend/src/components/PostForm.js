import { useState, useEffect } from "react";

function PostForm({ onPostAdded }) {
    const [formData, setFormData] = useState({
        title:'',
        content:'',
        author:'Macro',
        tags:''
    });

    const[isSubmitting, setIsSubmitting] = useState(false);
    const[showForm, setShowForm] = useState(false);

    const handleChange=(e) => {
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
            const postData ={
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const response = await fetch('/api/posts', {
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(postData)
            });

            if(response.ok) {
                const newPost = await response.json();

                setFormData({
                    title:'',
                    content:'',
                    author:'Macro',
                    tags:''
                });
                setShowForm(false);

                if(onPostAdded) {
                    onPostAdded(newPost);
                }
            } else {
                    alert('Eroare la adaugarea postarii');
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
                <button 
                    className="add-post-btn"
                    onClick={() => setShowForm(true)}
                >
                    + Adaugă postare nouă
                </button>
            ) : (
                <form className="post-form" onSubmit={handleSubmit}>
                    <h3>Postare nouă</h3>
                    
                    <div className="form-group">
                        <label htmlFor="title">Titlu:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Scrie titlul postării..."
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
                            placeholder="Scrie conținutul postării..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="author">Autor:</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Numele autorului..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tag-uri (separate prin virgulă):</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="react, javascript, tutorial..."
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => setShowForm(false)}
                        >
                            Anulează
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
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
