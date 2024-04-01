import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faStar } from "@fortawesome/free-solid-svg-icons";

import "../App.css";

function Under_Header() {
  const navigateTo = useNavigate();

  const isLogged = localStorage.getItem("isLoggedIn");

  const [search, setSearch] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();

    navigateTo(`/coins-by-search/${search}`);
  };

  return (
    <div className="under-header-container">
      <div className="links">
        <Link to="/coins-by-category/defi">defi</Link>
        <Link to="/coins-by-category/nft">nft</Link>
        <Link to="/coins-by-category/metaverse">metaverse</Link>
        <Link to="/coins-by-category/gaming">gaming</Link>
        <Link to="/coins-by-category/web3">web3</Link>
      </div>

      <div className="form-container">
        <Link
          to={isLogged === "true" ? "/favorite-coins" : "/login"}
          className="watch-list-link"
        >
          <FontAwesomeIcon icon={faStar} className="star-icon" />{" "}
          <span>WatchList</span>
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
    </div>
  );
}

export default Under_Header;
