import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function Login_PopUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("http://localhost:9000/login", {
        email: email,
        password: password,
      });

      const expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60);

      console.log(response.data);
      props.onLogin(response.data.token, true, expirationTime);
    } catch (err) {
      console.log("Error from the login handler in the front-end", err);
    }
  };

  return (
    <div className="auth-popups">
      <div
        className="auth-container"
        onClick={() => {
          props.onLoginClose(false);
        }}
      ></div>
      <form
        style={{
          display: "flex",
          alignItems: "start",
          flexDirection: "column",
        }}
        onSubmit={loginHandler}
      >
        <div
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            marginBottom: "15px",
          }}
        >
          <label for="email" style={{ marginBottom: "5px" }}>
            Email
          </label>
          <input
            placeholder="Enter your email"
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            marginBottom: "30px",
          }}
        >
          <label for="password" style={{ marginBottom: "5px" }}>
            Password
          </label>
          <input
            placeholder="Enter your password"
            type="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>

        <button>Login</button>
      </form>
    </div>
  );
}

export default Login_PopUp;
