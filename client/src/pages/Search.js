import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import CoinTable from "../components/CoinTable";
import "../App.css";

import LoadingSpinner from "../components/LoadingSpinner";

function Search() {
  const { search } = useParams();
  const [coins, setCoins] = useState([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://coinranking1.p.rapidapi.com/coins?search=${search}`,
      params: {
        referenceCurrencyUuid: "yhjMzLPhuIDl",
        timePeriod: "1h",
        "tiers[0]": "1",
        orderDirection: "desc",
        offset: "0",
        limit: 5000,
      },
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
        "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
      },
    };

    const getAllCoins = async () => {
      try {
        const response = await axios.request(options);
        const newCoins = response.data.data.coins;
        setCoins(newCoins);
        console.log(newCoins);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Error fetching coins:", err);
      }
    };

    getAllCoins();
  }, [search]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{search}</title>
      </Helmet>
      {isDataLoaded === false && <LoadingSpinner />}
      <CoinTable data={coins} />
    </React.Fragment>
  );
}

export default Search;
