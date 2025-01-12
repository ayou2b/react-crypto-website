import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import { Helmet } from "react-helmet";
import CoinTable from "../components/CoinTable";

import LoadingSpinner from "../components/LoadingSpinner";

import MarketInfo from "../components/Market_info";

function Coins_By_Category() {
  const { category } = useParams();
  const [coins, setCoins] = useState([]);

  const [row, setRow] = useState(20);
  const [sortBy, setSortBy] = useState("marketCap");

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem("row", row);
    localStorage.setItem("sortBy", sortBy);
  }, [row, sortBy]);

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://coinranking1.p.rapidapi.com/coins",
      params: {
        referenceCurrencyUuid: "yhjMzLPhuIDl",
        timePeriod: "1h",
        "tiers[0]": "1",
        orderBy: localStorage.getItem("sortBy"),
        orderDirection: "desc",
        limit: localStorage.getItem("row"),
        offset: "0",
        tags: [`${category}`],
      },
      headers: {
        "X-RapidAPI-Key": "your API key",
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
      },
    };

    const getAllCoins = async () => {
      try {
        const response = await axios.request(options);
        const newCoins = response.data.data.coins;
        setCoins(newCoins);
        console.log(row);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    };

    getAllCoins();
  }, [row, sortBy, category]);

  return (
    <div>
      <Helmet>
        <title>{category}</title>
      </Helmet>
      {isDataLoaded === false && <LoadingSpinner />}

      <MarketInfo />

      <div className="filter-container">
        <form>
          <label htmlFor="rows">Show rows: </label>
          <select
            name="rows"
            id="rows"
            value={localStorage.getItem("row")}
            onChange={(e) => {
              setRow(e.target.value);
              localStorage.setItem("row", e.target.value);
            }}
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </form>

        <form>
          <label htmlFor="sort">Sort by: </label>
          <select
            name="sort"
            id="sort"
            value={localStorage.getItem("sortBy")}
            onChange={(e) => {
              setSortBy(e.target.value);
              localStorage.setItem("sortBy", e.target.value);
            }}
          >
            <option value="marketCap">marketCap</option>
            <option value="price">price</option>
            <option value="24hVolume">24hVolume</option>
            <option value="change">change</option>
            <option value="listedAt">listedAt</option>
          </select>
        </form>
      </div>

      <CoinTable data={coins} />

      <div className="btn-container">
        <button
          className="load-btn"
          disabled={row > 5000}
          onClick={() => {
            setRow((prev) => {
              return +prev + +prev;
            });
          }}
        >
          Load More Coins
        </button>
      </div>
    </div>
  );
}

export default Coins_By_Category;
