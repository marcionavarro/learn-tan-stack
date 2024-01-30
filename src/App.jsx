import { useQuery } from 'react-query'
import axios from 'axios';
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
    pokemon,
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return axios
        .get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        .then(res => res.data)
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
