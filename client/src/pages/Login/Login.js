import React from "react";
import useLogin from "../../hooks/use-login";

function Login() {
  const { register, handleSubmit, login } = useLogin();
  return (
    <div>
      <form onSubmit={handleSubmit(login)}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            {...register("username")}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            {...register("password")}
          />
        </div>
        <div>
          <button>Sign In</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
