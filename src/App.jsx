import { useQuery } from 'react-query'
import axios, { CancelToken } from 'axios';
import './App.css'
import { useState } from 'react';

function App() {
  const [pokemon, setPokemon] = useState('');
  return (
    <div>
      <input value={pokemon} onChange={(e) => setPokemon(e.target.value)} />
      <PokemonSearch pokemon={pokemon} />
    </div>
  )
}


function PokemonSearch({ pokemon }) {
  const queryInfo = useQuery(
    ['pokemon', pokemon],
    async () => {
      const controller = new AbortController();

      const signal = controller.signal;

      const promise = new Promise(resolve => setTimeout(resolve, 1000))
        .then(() => {
          return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
              method: 'get',
              signal
            })
            .then(res => res.json())

          promise.cancel = () => {
            controller.abort()
          }
        })

      return promise
    },
    {
      enabled: true,
    }
  );

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data?.sprites?.front_default ? (
        <img src={queryInfo.data.sprites.front_default} alt='pokemon' />
      ) : (
        'Pokemon not found.'
      )}
      <br />
      {queryInfo.isFetching ? 'Updating...' : null}
    </div>
  )
}

export default App;
