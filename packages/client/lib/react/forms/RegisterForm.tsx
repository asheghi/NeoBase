import React, { useEffect, useState } from "react"
import { FormLayout } from "./FormLayout"
import { useAuth } from "../AuthProvider";
import GoogleLogo from '../../assets/icons/google-logo.svg';
import GithubLogo from '../../assets/icons/github-logo.svg';
import { useOAuthProviders } from "./useOAuthProviders";

type LoginFormProps = {
  returnTo?: string,
}

export const RegisterForm = (props: LoginFormProps) => {
  const { api, fetchUser, user } = useAuth();

  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>()

  const oAuthProviders = useOAuthProviders(api);

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!(username && password)) {
      setError('please enter username and password!')
      return;
    }
    setError(undefined);
    setLoading(true);
    api?.Auth.register({
      email,
      username,
      password,
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

  const returnTo = props.returnTo ?? window.location.href;

  useEffect(() => {
    if (user && returnTo) {
      console.log('user already logged in redirecting to returnTo', returnTo);

      window.location.href = returnTo;
    }
  }, [returnTo, user])

  return <FormLayout>
    <form onSubmit={handleSubmit} className="form">
      <div className="form-header">
        <h1>Sign up a new account</h1>
      </div>
      <div className="form-groups">
        <div>
          <label htmlFor="email">Email</label>
          <input value={email} id="email" onChange={e => setEmail(e.target.value)}
            type="text" placeholder="Enter your email" />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}
            type="text" placeholder="Enter your username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter your password" />
        </div>
      </div>

      <button disabled={loading} className="contained-btn">
        {loading ? 'Signing up' : 'Sign up'}
      </button>
      {
        error && <div className="error-container">
          <div className="error-message">
            {error}
          </div>
        </div>
      }
      <div className="flex justify-center pt-8 gap-4">
        {
          oAuthProviders.includes('google') && <a href={api.Auth.loginWithGoogleUrl} className="">
            <div className="flex items-center gap-2 border border-gray-300 px-2 py-1 rounded">
              <img src={GoogleLogo} alt="google-icon" width="18" height="18" />
              Sign up with Google
            </div>
          </a>
        }
        {
          oAuthProviders.includes('github') && <a href={api.Auth.loginWithGithubUrl + "?returnTo=" + btoa(returnTo)} className="">
            <div className="flex items-center gap-2 border border-gray-300 px-2 py-1 rounded">
              <img src={GithubLogo} alt="google-icon" width="18" height="18" />
              Sign up with Github
            </div>
          </a>
        }
      </div>
    </form>
  </FormLayout>
}