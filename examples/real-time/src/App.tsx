import { useEffect } from "react";
import { Socket } from "./api"
import { useAuth, Forms } from "@neobase/client/react";
import '@neobase/client/react/theme.css'

function App() {
  const { loading, user, api, } = useAuth();
  const handleClick = () => {
    Socket.emit('ping')
  }

  useEffect(() => {
    Socket.emit('watch',{collection:'todos'});

    Socket.onAny((...args) => {
      console.log('SOCKET:',...args);

    })

    handleClick();
  },[]);

  const createTodo = () => {
    api?.Collection('todos').create({name:"test - " + Date.now()})
  }

  const deleteTodo = () => {
    api?.Collection('todos').deleteOne({})
  }

  const updateTodo = () => {
    api?.Collection('todos').updateOne({}, {$set:{name: 'updated ' + Date.now()}})
  }

  if (!loading && !user) {
    return <Forms.LoginForm />
  }

  return (
    <div style={{display:'flex', gap:8}}>
      <button onClick={createTodo}>Create Todo</button>
      <button onClick={deleteTodo}>Delete Todo</button>
      <button onClick={updateTodo}>Update Todo</button>
    </div>
  )
}

export default App
