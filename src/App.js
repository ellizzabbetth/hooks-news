import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';

export default function App(){
  // when state is set our components rerender
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('react hooks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef();

  // useEffects runs after every rerender
  useEffect( () => {
    getResults();
    // .then(response => {
    //   console.log(response.data);
    //   setResults(response.data.hits);
    // })
  }, []); // second argument of empty array ensures that
  // conents of useEffect function runs only on componentMount
  // and not on any updates
  const getResults = async () => {
    setLoading(true);
    try{
      const response = await axios.get(`http://hn.algolia.com/api/v1/search?query=${query}`)
      setResults(response.data.hits);
    } catch(err) {
      setError(err);
    }

    setLoading(false);
  }

  const handleSearch = event => {
    event.preventDefault(); // prevents page from reloading
    getResults();
  }

  const handleClearSearch = () => {
    setQuery("");
    searchInputRef.current.focus();
  };


  return(
    <>
    <form onSubmit={handleSearch}>
      <input
        type="text"
        onChange = {event => setQuery(event.target.value)}
        value={query}
        ref={searchInputRef}
      />
      <button type="submit" >Search</button>
      <button type="button" onClick={handleClearSearch}>Clear</button>
    </form>
    {loading ? (
      <div>Loading result ...</div>
    ) : (
      <ul>
      {results.map(result => (
        <li key={result.objectID}>
        <a href={result.url}>{result.title}</a>
        </li>
      ))}
    </ul>
  )}
    {error && <div>{error.message}</div>}
    </>
  );
}
