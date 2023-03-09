import React, { FormEvent, useState } from "react";

interface ILoginPage {
  redirectUrl?: string;
}

export const Page = (props: ILoginPage) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result: { success: boolean } = await fetch(
      "/api/user/auth/register/password",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        cache: "no-cache",
      }
    ).then((r) => r.json());

    if (!result.success) {
      return;
    }

    window.location.href =
      props.redirectUrl ??
      window.location.protocol + "//" + window.location.hostname + "/";
  };

  return (
    <>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit} action="" method="post">
        <section>
          <label htmlFor="username">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            autoFocus
          />
        </section>
        <section>
          <label htmlFor="current-password">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="current-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </section>
        <button type="submit">Sign up</button>
      </form>
    </>
  );
};
