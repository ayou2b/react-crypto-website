import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faStar,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import "../App.css";
import { Link, useNavigate } from "react-router-dom";

function Header(props) {
  const [marketInfo, setMarketInfo] = useState({});

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLogged = localStorage.getItem("isLoggedIn");

  const [search, setSearch] = useState("");

  const navigateTo = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();

    navigateTo(`/coins-by-search/${search}`);

    setIsMenuOpen(false);
  };

  useEffect(() => {
    const getMarketData = async () => {
      const options = {
        method: "GET",
        url: `https://coinranking1.p.rapidapi.com/stats`,
        params: {
          referenceCurrencyUuid: "yhjMzLPhuIDl",
        },
        headers: {
          "X-RapidAPI-Key": "d4f1b300a0msh76feaae86a949fbp1933fajsn978768910107",
          "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response.data.data);
        setMarketInfo(response.data.data);
      } catch (err) {
        console.error("Error fetching coin details:", err);
      }
    };

    getMarketData();
  }, []);

  const formatMarketCap = (value) => {
    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;

    if (value >= trillion) {
      return `${(value / trillion).toFixed(2)}T`;
    } else if (value >= billion) {
      return `${(value / billion).toFixed(2)}B`;
    } else if (value >= million) {
      return `${(value / million).toFixed(2)}M`;
    } else {
      return `${value}`;
    }
  };

  const formatVolume = (value) => {
    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;

    if (value >= trillion) {
      return `${(value / trillion).toFixed(2)}T`;
    } else if (value >= billion) {
      return `${(value / billion).toFixed(2)}B`;
    } else if (value >= million) {
      return `${(value / million).toFixed(2)}M`;
    } else {
      return `${value}`;
    }
  };

  return (
    <React.Fragment>
      <div className="header-container">
        <div className="header">
          <Link to="/" className="logo">
            CRYPTO
          </Link>
          <p>
            Total Coins: <span>{marketInfo.totalCoins}</span>
          </p>
          <p>
            Market Cap:{" "}
            <span>
              ${marketInfo && formatMarketCap(marketInfo.totalMarketCap)}
            </span>
          </p>
          <p>
            BTC Dominance:{" "}
            <span>
              {marketInfo.btcDominance !== undefined &&
                marketInfo.btcDominance.toFixed(2)}
              %
            </span>
          </p>
          <p>
            24h Vol:{" "}
            <span>
              ${marketInfo && formatVolume(marketInfo.total24hVolume)}
            </span>
          </p>
        </div>

        <div className="header-btns">
          {isLogged === null && (
            <React.Fragment>
              <Link to="/login" className="header-btn sign_in">
                Sign In
              </Link>
              <Link to="/sign-up" className="header-btn sign_up">
                Sign Up
              </Link>
            </React.Fragment>
          )}

          {isLogged === "true" && (
            <React.Fragment>
              <button
                onClick={() => {
                  props.onLogout();
                }}
                className="header-btn sign_in"
              >
                Logout
              </button>
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="mobile-header">
        <Link to="/" className="logo">
          CRYPTO
        </Link>

        <FontAwesomeIcon
          icon={faBars}
          onClick={() => {
            setIsMenuOpen(true);
          }}
        />
      </div>

      {isMenuOpen === true && (
        <div className="menu">
          <button
            onClick={() => {
              setIsMenuOpen(false);
            }}
            className="close-btn"
          >
            <FontAwesomeIcon icon={faXmark} size={30} />
          </button>

          <div className="menu-elements">
            <div className="menu-links">
              <Link
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                to={isLogged === "true" ? "/favorite-coins" : "/login"}
                className="watch-list-link"
              >
                <FontAwesomeIcon icon={faStar} className="star-icon" />{" "}
                <span>WachList</span>
              </Link>

              <form className="search-form" onSubmit={searchHandler}>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  size={10}
                  className="search-icon"
                />
                <input
                  placeholder="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                ></input>
              </form>
            </div>
            <div className="menu-btns">
              {isLogged === null && (
                <React.Fragment>
                  <Link
                    to="/login"
                    className="header-btn sign_in"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="header-btn sign_up"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Link>
                </React.Fragment>
              )}

              {isLogged === "true" && (
                <React.Fragment>
                  <button
                    onClick={() => {
                      props.onLogout();
                    }}
                    className="header-btn sign_in"
                  >
                    Logout
                  </button>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Header;
