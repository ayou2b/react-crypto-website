import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import "../App.css";

function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signUpHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "react-crypto-website-ebon.vercel.app/signup",
        {
          name: name,
          email: email,
          password: password,
        }
      );

      console.log(response.data);
      navigate("/login");
    } catch (err) {
      console.log(err.response.data.errorMessage);
      setError(err.response.data.errorMessage);
    }
  };

  return (
    <div className="auth-popups">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className="auth-container"></div>

      {error !== "" && <div className="error">{error}</div>}

      <form
        style={{
          display: "flex",
          alignItems: "start",
          flexDirection: "column",
        }}
        onSubmit={signUpHandler}
      >
        <div
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            marginBottom: "15px",
          }}
        >
          <label for="name" style={{ marginBottom: "5px" }}>
            Name
          </label>
          <input
            placeholder="Enter your Name"
            type="name"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </div>

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
            // type="email"
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

        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
