import React, { useState } from "react"
import { FormLayout } from "./FormLayout"
import { useAuth } from "../AuthProvider";
import GoogleLogo from '../../assets/icons/google-logo.svg';

export const LoginForm = () => {
  const { api, fetchUser } = useAuth();

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>()

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!(username && password)) {
      setError('please enter username and password!')
      return;
    }
    setError(undefined);
    setLoading(true);
    api?.Auth.login({
      username,
      password,
      rememberMe
    })
      .then(() => {
        fetchUser();
      })
      .catch(e => {
        setError(e.message ?? String(e));
      })
      .finally(() => {
        setLoading(false);
      })
  }
  function handleForgetPassword(e: any) {
    e.preventDefault();
  }

  return <FormLayout>
    <form onSubmit={handleSubmit} className="form">
      <div className="form-header">
        <h1>Sign in to your account</h1>
      </div>
      <div className="form-groups">
        <div>
          <label htmlFor="username">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}
            type="text" placeholder="Enter your username or email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter your password" />
        </div>
      </div>
      <div className="remember-forget ">
        <div className="remember-me">
          <input onChange={e => setRememberMe(e.target.checked)} id="remember-me" type="checkbox" />
          <label htmlFor="remember-me" >Remember me</label>
        </div>
        <a onClick={handleForgetPassword} className="text-btn">
          Forgot Password?
        </a>
      </div>
      <button disabled={loading} className="contained-btn">
        {loading ? 'Signing in' : 'Sign in'}
      </button>
      {
        error && <div className="error-container">
          <div className="error-message">
            {error}
          </div>
        </div>
      }
      <div className="flex justify-center pt-8">
        <a href={api.Auth.loginWithGoogleUrl} className="">
          <div className="flex items-center gap-2 border border-gray-300 px-2 py-1 rounded">
            <img src={GoogleLogo} alt="google-icon" width="18" height="18" />
            Sign in with Google
          </div>
        </a>
      </div>
    </form>
  </FormLayout>
}