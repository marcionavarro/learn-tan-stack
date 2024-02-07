import { QueryCache, QueryClient, useQuery } from 'react-query'
import axios from 'axios';
import React, { useEffect, useReducer } from 'react';

const queryClient = new QueryClient();
function App() {
  const [show, toggle] = useReducer(d => !d, false);

  useEffect(() => {
    queryClient.prefetchQuery('posts', fetchPosts);
  }, [])

  return (
    <div>
      <button onClick={toggle}>Show Posts</button>
      {show ? <Posts /> : null}
    </div>
  )

}

async function fetchPosts () {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return axios.
      get('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.data.slice(0, 10))
}

function Posts({ setPostId }) {
  const postsQuery = useQuery('posts', fetchPosts)

  return (
    <div>
      <h1>Posts {postsQuery.isFetching ? '...' : null}</h1>
      <div>
        {postsQuery.isLoading ? (
          'Loading posts...'
        ): (
          <ul>
            {postsQuery.data.map(post => {
              return <li key={post.id}>
                <a  onClick={() => setPostId(post.id)} href='#'>
                  {post.title}
                </a>
              </li>
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App;
