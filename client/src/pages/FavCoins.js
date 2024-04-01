import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import CoinTable from "../components/CoinTable";

import LoadingSpinner from "../components/LoadingSpinner";

import Auth from "../Context/Auth";

function FavCoins() {
  const [coins, setCoins] = useState([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { token } = useContext(Auth);

  useEffect(() => {
    const getUserFavCoins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/get-user-coins",
          {
            headers: {
              authorisation: "Bearer " + token,
            },
          }
        );

        console.log(response.data.coins);

        setCoins(response.data.coins);
        setIsDataLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    getUserFavCoins();
  }, [token]);

  return (
    <div>
      <Helmet>
        <title>WatchList</title>
      </Helmet>
      {isDataLoaded === false && <LoadingSpinner />}

      <CoinTable data={coins} />
    </div>
  );
}

export default FavCoins;
