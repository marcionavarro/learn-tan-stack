import { useQuery } from 'react-query'
import axios from 'axios';
import './App.css'

const email = 'Sincere@april.biz'

function MyPosts() {
  const userQuery = useQuery('user', () => (
    axios.get(`https://jsonplaceholder.typicode.com/users?email=${email}`).then(res => res.data[0])
  ))

  const postsQuery = useQuery('posts', () => (
    axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userQuery.data.id}`).then(res => res.data, {
      enabled:  userQuery?.data.id
    })
  ))

  console.log(userQuery.data.id);


  return userQuery.isLoading ? (
    'Loading user...'
  ) : (
    <div>User ID: {userQuery.data.id}
      <br /> <br />
      {postsQuery.isIdle ? null :
        postsQuery.isLoading ? (
          'Loading posts ...'
        ) : (
          <div>Post Count: {postsQuery.data.length}</div>
        )
      }
    </div>
  )
}

function App() {
  return (
    <div>
      <MyPosts />
    </div>
  )
}

export default App;
