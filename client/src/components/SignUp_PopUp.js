import React, { useState } from "react";

import axios from "axios";

import "../App.css";

function Login_PopUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("http://localhost:9000/signup", {
        name: name,
        email: email,
        password: password,
      });

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth-popups">
      <div
        className="auth-container"
        onClick={() => {
          props.onSignUpClose(false);
        }}
      ></div>
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

export default Login_PopUp;
