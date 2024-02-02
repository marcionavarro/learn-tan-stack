import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';
import axios from 'axios';
import { useReducer, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom';
const queryClient = new QueryClient();


function App() {
  const [postId, setPostId] = useState(-1)

  return (
    <div>
      <QueryClientProvider client={queryClient}>

        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Posts />} />
            <Route path='/:postId' element={<Post />} />
          </Routes>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </div >
  )
}

const fetchPosts = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const posts = await axios.get('https://jsonplaceholder.typicode.com/posts').then(res => res.data)

  posts.forEach(post => {
    queryClient.setQueryData(['post', post.id], post)
  })

  console.log('On success')

  return posts
}

function Posts() {
  const postsQuery = useQuery('posts', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return axios.get('https://jsonplaceholder.typicode.com/posts').then(res => res.data)
  },{
    cacheTime: 10000,
  })

  return (
    <div>
      <h1>
        Posts {postsQuery.isFetching ? '...' : null}
      </h1>

      {postsQuery.isLoading ? (
        'Loading posts...'
      ) : (
        <div>
          <ul>
            {postsQuery.data.map(post => {
              return (
                <li key={post.id}>
                  <Link to={`/${post.id}`}>{post.title}</Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function Post() {
  const { postId } = useParams()

  const postQuery = useQuery(['post', postId], async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.data)
  })

  return (
    <div>
      <Link to='/'>Voltar</Link>
      <br /><br />
      {postQuery.isLoading ? 'Loading post...'
        : (
          <>
            {postQuery.data.title}
            <br /><br />
            {postQuery.isFetching ? 'Updating...' : null}
          </>
        )}
    </div>
  )
}

export default App;
