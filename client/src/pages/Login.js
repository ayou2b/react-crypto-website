import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../App.css";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "https://react-crypto-website-ebon.vercel.app/login",
        {
          email: email,
          password: password,
        }
      );

      const expirationTime = new Date(new Date().getTime() + 1000 * 60 * 60);

      console.log(response.data);
      props.onLogin(response.data.token, true, expirationTime);
      navigate("/");
    } catch (err) {
      console.log("Error from the login handler in the front-end", err);
      setError(err.response.data.errorMessage);
    }
  };

  return (
    <div className="auth-popups">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="auth-container"></div>

      {error !== "" && <div className="error">{error}</div>}

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

export default Login;
