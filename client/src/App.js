import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Auth from "./Context/Auth";

import Home from "./pages/Home";
import Coin from "./pages/Coin";
import CoinsByCategory from "./pages/Coins_By_Category";
import Search from "./pages/Search";
import FavCoins from "./pages/FavCoins";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import Header from "./components/Header";
import UnderHeader from "./components/Under_Header";

let logoutTimer;

function App() {
  const [token, setToken] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [expirationTime, setExpirationTime] = useState(null);

  const loginHandLer = useCallback((tkn, logged, expiration) => {
    setToken(tkn);
    setIsLogged(logged);

    const expirationDate =
      expiration || new Date(new Date().getTime() + 1000 * 60 * 60);

    setExpirationTime(expirationDate);

    localStorage.setItem("token", tkn);
    localStorage.setItem("isLoggedIn", logged);
    localStorage.setItem("expiration", expirationDate);
  }, []);

  const logoutHandler = useCallback(() => {
    setIsLogged(false);
    setToken("");
    setExpirationTime("");

    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("expiration");
  }, []);

  useEffect(() => {
    if (token && expirationTime) {
      const remainingTime = expirationTime.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, expirationTime, logoutHandler]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedExpirationTime = localStorage.getItem("expiration");
    const storedUserId = localStorage.getItem("userId");

    if (
      storedToken &&
      storedIsLoggedIn &&
      new Date(storedExpirationTime) > new Date()
    ) {
      loginHandLer(
        storedToken,
        storedIsLoggedIn,
        new Date(storedExpirationTime),
        storedUserId
      );
    }
  }, [loginHandLer]);

  return (
    <div>
      <Auth.Provider
        value={{
          token: token,
          isLoggedIn: isLogged,
          expirationTime: expirationTime,
        }}
      >
        <Router>
          <Header onLogout={logoutHandler} />

          <UnderHeader />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:coinId" element={<Coin />} />
            <Route path="/login" element={<Login onLogin={loginHandLer} />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/coins-by-category/:category"
              element={<CoinsByCategory />}
            />
            <Route path="/coins-by-search/:search" element={<Search />} />
            <Route path="/favorite-coins" element={<FavCoins />} />
          </Routes>
        </Router>
      </Auth.Provider>
    </div>
  );
}

export default App;
