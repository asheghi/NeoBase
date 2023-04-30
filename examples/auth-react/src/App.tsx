import { Forms, useAuth } from '@neobase/client/react';
import { Api } from './api';
import '@neobase/client/react/theme.css'

function App() {
  const auth = useAuth();
  if (auth.loading) {
    return <div>
      Fetching user ...
    </div>
  }

  if (auth.user) {
    const handleLogout = async () => {
      auth.logout();
    };
    return <div>
      Logged in as {auth.user.username ?? auth.user.email ?? auth.user.id}
      <br />
      <button onClick={handleLogout}>Logout!</button>
    </div>
  }

  if (!auth.user) {
    return <div style={{ height: '100vh', width: '100%', }}>
      <Forms.LoginForm />
    </div>
  }
  return <></>
}

export default App
