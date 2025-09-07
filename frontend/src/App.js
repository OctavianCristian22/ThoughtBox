import { useState } from "react";
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import './App.css';

function App() {
  const [message,setMessage]=useState('');
  const [refreshPosts, setRefreshPosts] = useState(0);

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

  return (
    <div className="App">
      <header className="app-header">
        <h1>ThoughtBox</h1>
        <p>You have a thought? Write it down.</p>
      </header>

      <main>
        <PostForm onPostAdded={handlePostAdded} />
        <PostList key={refreshPosts} />

        <div className="test-section">
          <button onClick={testBackend}>Test Backend</button>
          {message && <p>Mesaj de la server: {message}</p>}
        </div>
      </main>
    </div>
  );
}

export default App;