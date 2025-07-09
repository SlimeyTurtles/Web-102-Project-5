import { useEffect, useState } from 'react'
import CatCard from './components/CatCard'
import './App.css'

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [saved_cats, setSavedCats] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchData = async () => {
    try {
      setLoading(true);

      const urlWithParams = `${API_URL}?has_breeds=1&limit=1`;

      const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const newCat = data[0];
      const newBreed = newCat?.breeds?.[0]?.name;

      const duplicate = saved_cats.some(
        (cat) => cat.breeds?.[0]?.name === newBreed
      );

      if (duplicate) {
        console.log(`Duplicate breed "${newBreed}" found, refetching...`);
        fetchData(); // 🔁 Try again with a new cat
      } else {
        setData(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const keepBreed = () => {
    if (!data || data.length === 0) return;

    const newCat = data[0];
    const newBreed = newCat.breeds?.[0]?.name;

    const alreadySaved = saved_cats.some(
      cat => cat.breeds?.[0]?.name === newBreed
    );

    if (alreadySaved) return;

    const updated = [...saved_cats, newCat];
    setSavedCats(updated);

    console.log(saved_cats.map(cat => cat.breeds?.[0]?.name))
  }

  const removeCat = (id) => {
    setSavedCats(saved_cats.filter(cat => cat.id !== id));
    console.log(saved_cats.map(cat => cat.breeds?.[0]?.name))
  };
  
  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <h1>Random Cat Getter</h1>
        
        <button onClick={fetchData}>Get New Cat 🐱</button>
        
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <h2>{data[0].breeds[0].name}</h2>
          <img 
            src={data[0].url} 
            alt="Cat with breed info" 
            style={{ width: '200px', height: 'auto', verticalAlign: 'middle' }} 
          />
          <button onClick={keepBreed}>Keep Breed</button>
        </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {saved_cats.map(cat => (
          <CatCard key={cat.id} cat={cat} onRemove={removeCat} />
        ))}
      </div>
    </>
  )
}

export default App
