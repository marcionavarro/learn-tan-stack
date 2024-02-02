import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';
import axios from 'axios';
import { useState } from 'react';


function Posts({ setPostId }) {
  const postsQuery = useQuery('posts', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return axios.get('https://jsonplaceholder.typicode.com/posts').then(res => res.data)

  })

  return (
    <div>
      <h1>Posts {postsQuery.isFetching ? '...' : null}</h1>
      {postsQuery.isLoading ? (
        'Loading posts...'
      ) : (
        <div>
          {postsQuery.data.map(post => {
            return (
              <div key={post.id}>
                <a href='#' onClick={() => setPostId(post.id)}>
                  {post.title}
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Post({ postId, setPostId }) {
  const postQuery = useQuery(['posts', postId], async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.data)
  })
  return (
    <div>
      <a href='#' onClick={() => setPostId(-1)}>
        Back
      </a>
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


function App() {
  const queryClient = new QueryClient();
  const [postId, setPostId] = useState(-1)
  return (
    <div>
      <QueryClientProvider client={queryClient}>

        {postId > -1 ? (
          <Post postId={postId} setPostId={setPostId} />
        ) : (
          <Posts setPostId={setPostId} />
        )}


        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </div >
  )
}

export default App;
