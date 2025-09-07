import { useState, useEffect } from "react";

function PostList() {
    const [ posts, setPosts ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect (() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch ('/api/posts');
            const data = await response.json();
            setPosts(data);
            setLoading(false);
        }
        catch (error) {
            console.error("Eroare la incarcarea postarilor: ", error);
            setLoading(false);
        }
    };

    if(loading) return <div>Se incarca postarile...</div>

    return (
        <div className="posts-container">
            <h2>Toate postarile</h2>
            {posts.length === 0 ? (
                <p>Nu exista postari inca.</p>
            ) : (
                <div className="posts-grid">
                    {posts.map(post => (
                        <div key={post.id} className="post-card">
                            <h3>{post.title}</h3>
                            <p className="post-preview">
                                {post.content.substring(0,100)}...
                            </p>
                            <div className="post-meta">
                                <span>De: {post.author}</span>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            </div>
                    ))}
                    </div>
            )}
        </div>
    );
}

export default PostList;