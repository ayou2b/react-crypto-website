import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";

import "../App.css";

function formatMarketCap(marketCap) {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)} Trillion`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)} Billion`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)} Million`;
  } else {
    return `$${marketCap ? marketCap.toFixed(2) : "0.00"}`;
  }
}

function Market_info() {
  const [marketInfo, setMarketInfo] = useState({});

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

        setMarketInfo(response.data.data);
      } catch (err) {
        console.error("Error fetching coin details:", err);
      }
    };

    getMarketData();
  }, []);

  return (
    <div className="market-info-main-container">
      <div className="title">
        <h1>Cryptocurrency Prices by Market Cap</h1>
        <p>
          The global cryptocurrency market cap today is{" "}
          {formatMarketCap(marketInfo.totalMarketCap)}
        </p>
      </div>
      <div className="market-info-container">
        <div className="market-info">
          <div>
            <p style={{ fontSize: "25px", fontWeight: "bold" }}>
              {marketInfo.totalMarketCap
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(marketInfo.totalMarketCap)
                : "$0.00"}
            </p>
            <p style={{ fontWeight: "500", marginTop: "10px" }}>Market Cap</p>
          </div>
          <div>
            <p style={{ fontSize: "25px", fontWeight: "bold" }}>
              {marketInfo.total24hVolume
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(marketInfo.total24hVolume)
                : "$0.00"}
            </p>
            <p style={{ fontWeight: "500", marginTop: "10px" }}>
              24h Trading Volume
            </p>
          </div>
        </div>

        <div className="trending-coins-new-ones">
          <p style={{ fontWeight: "bold" }}>
            <FontAwesomeIcon icon={faFire} style={{ color: "#ff9500" }} />{" "}
            Trending
          </p>
          <div>
            {marketInfo.bestCoins &&
              marketInfo.bestCoins.map((coin) => {
                return (
                  <Link
                    to={`/coin/${coin.uuid}`}
                    key={coin.uuid}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    <img
                      src={coin.iconUrl}
                      style={{ width: "30px", marginRight: "15px" }}
                      alt="coin"
                    ></img>
                    <p>{coin.name}</p>
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="trending-coins-new-ones">
          <p style={{ fontWeight: "bold" }}>Newest Coins</p>
          <div>
            {marketInfo.newestCoins &&
              marketInfo.newestCoins.map((coin) => {
                return (
                  <Link
                    to={`/coin/${coin.uuid}`}
                    key={coin.uuid}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    <img
                      src={coin.iconUrl}
                      style={{ width: "30px", marginRight: "15px" }}
                      alt="coin"
                    ></img>
                    <p>{coin.name}</p>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Market_info;
