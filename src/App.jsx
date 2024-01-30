import { useQuery } from 'react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
import axios from 'axios';
import './App.css'


function Pokemon() {
  const queryInfo = useQuery('pokemon', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return axios
      .get('https://pokeapi.co/api/v2/pokemon')
      .then(res => res.data.results)
  })

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo?.data.map((result) => {
        return <div key={result.name}>{result.name}</div>
      })}
    </div>
  )
}

function App() {
  return (
    <div>
        <Pokemon />
    </div>
  )
}

export default App;
