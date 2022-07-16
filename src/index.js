import React, { useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import endpoint from './endpoint';
import './styles.scss';

const initialState = {
  result: null,
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return initialState;
    case 'RESPONSE_COMPLETE':
      return {
        result: action.payload.result,
        loading: false,
        error: null,
      };
    case 'ERROR':
      return {
        loading: false,
        error: action.payload.error,
        result: null,
      };
    default:
      return state;
  }
};

const useFetch = (url) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOADING' });

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'RESPONSE_COMPLETE', payload: { result: data } });
      })
      .catch((error) => {
        dispatch({ type: 'ERROR', payload: { error } });
      });
  }, []);

  return [state.result, state.loading, state.error];
};

const Application = () => {
  const [response, loading, error] = useFetch(endpoint + '/characters');
  const characters = response?.characters || [];

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <CharacterList characters={characters} />
          )}
          {error && <p className="error">{error.message}</p>}
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
