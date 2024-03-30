import { useState, useEffect } from 'react';

const KEY = '9a947933';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const [query, setQuery] = useState('');

  useEffect(
    function () {
      // callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('');

          const res = await fetch(
            ` http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          // Error Handling....
          if (!res.ok)
            throw new Error('Something went wrong with fetching movies');

          const data = await res.json();
          console.log(data);
          if (data.Response === 'False') throw new Error('Movie not found');
          setMovies(data.Search);
          console.log(data.Search);
          setError('');
        } catch (err) {
          console.log(err.message);

          if (err.name !== 'AbortError') {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }
      // handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
