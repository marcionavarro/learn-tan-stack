import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';
import axios from 'axios';
import { useReducer, useState } from 'react';

const queryClient = new QueryClient();
function App() {

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

const fetchPosts = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const posts = await axios.get('https://jsonplaceholder.typicode.com/posts').then(res => res.data)

  posts.forEach(post => {
    queryClient.setQueryData(['post', post.id], post)
  })

  console.log('On success')

  return posts
}

function Posts({ setPostId }) {
  const [count, increment] = useReducer(d => d + 1, 0)
  const postsQuery = useQuery('posts', fetchPosts, {
    onSuccess: data => {
      increment();
    },
    onError: (error) => {

    },
    onSettled: (data, error) => {

    }
  })

  return (
    <div>
      <h1>
        Posts {postsQuery.isFetching ? '...' : null}{' '}
        {count}
      </h1>

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
  const postQuery = useQuery(['post', postId], async () => {
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

export default App;
