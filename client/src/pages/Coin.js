import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Icon } from "react-icons-kit";
import { starEmpty } from "react-icons-kit/icomoon/starEmpty";
import { starFull } from "react-icons-kit/icomoon/starFull";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import LoadingSpinner from "../components/LoadingSpinner";

import "../App.css";

import Auth from "../Context/Auth";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function Coin() {
  const { coinId } = useParams();
  const [coinDetails, setCoinDetails] = useState(null);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [isCoinExist, setIsCoinExist] = useState(false);

  const navigateTo = useNavigate();

  const isLogged = localStorage.getItem("isLoggedIn");

  const [coinChart, setCoinChart] = useState([]);

  const { token } = useContext(Auth);

  const [period, setPeriod] = useState("24h");

  const theTimePeriod = ["1h", "3h", "12h", "24h", "7d", "30d"];

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

        console.log(response.data);

        const isCoinFound = await response.data.coins.find(
          (coin) => coin.uuid === coinId
        );

        if (isCoinFound !== undefined) {
          setIsCoinExist(true);
        } else {
          setIsCoinExist(false);
        }

        console.log(isCoinFound);
      } catch (err) {
        console.log(err);
      }
    };

    getUserFavCoins();
  }, [token, coinId]); // Dependency array with token

  const addCoinToMyFavHandler = async () => {
    try {
      if (isLogged !== "true") {
        return navigateTo("/login");
      }

      const response = await axios.post(
        "https://react-crypto-website-ebon.vercel.app/add-coin",
        {
          coinId: coinDetails.uuid,
          coinName: coinDetails.name,
          coinPrice: coinDetails.price,
          coinIcon: coinDetails.iconUrl,
          coinMarketCap: coinDetails.marketCap,
          coin24h: coinDetails.change,
        },
        {
          headers: {
            authorisation: "Bearer " + token,
          },
        }
      );

      console.log(response.data);

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

          console.log(response.data);

          const isCoinFound = await response.data.coins.find(
            (coin) => coin.uuid === coinId
          );

          if (isCoinFound !== undefined) {
            setIsCoinExist(true);
          } else {
            setIsCoinExist(false);
          }

          console.log(isCoinFound);
        } catch (err) {
          console.log(err);
        }
      };

      getUserFavCoins();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCoinFromFav = async () => {
    try {
      const response = await axios.post(
        `http://localhost:9000/delete-coin-from-fav/${coinId}`,
        {},
        {
          headers: {
            authorisation: "Bearer " + token,
          },
        }
      );

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getCoinDetails = async () => {
      const options = {
        method: "GET",
        url: `https://coinranking1.p.rapidapi.com/coin/${coinId}`,
        params: {
          referenceCurrencyUuid: "yhjMzLPhuIDl",
          timePeriod: period,
        },
        headers: {
          "X-RapidAPI-Key":
            "your API key",
          "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);

        console.log(response.data.data.coin);

        setCoinDetails(response.data.data.coin);
        setCoinChart(response.data.data.coin.sparkline);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("Error fetching coin details:", err);
      }
    };

    getCoinDetails();
  }, [coinId, period]);

  // Define chart options
  const options = {
    responsive: true,
  };

  // Prepare chart data
  const data = {
    labels: coinChart.map((value, idx) => {
      return idx;
    }),
    datasets: [
      {
        fill: true,
        label: coinDetails !== null && coinDetails.name,
        data: coinChart,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{coinDetails && coinDetails.name}</title>
      </Helmet>
      {isDataLoaded === false && <LoadingSpinner />}

      <div className="coin-details-container">
        {coinDetails !== null && (
          <div className="coin-main-container">
            <div className="coin-info">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src={coinDetails.iconUrl}
                  alt={coinDetails.name}
                  style={{ height: "50px", width: "50px" }}
                ></img>
                <h1
                  style={{
                    fontSize: "24px",
                  }}
                >
                  {coinDetails.name}
                  <span
                    style={{
                      color: "darkgrey",
                      fontSize: "20px",
                      marginLeft: "5px",
                    }}
                  >
                    {coinDetails.symbol}
                  </span>

                  <span
                    style={{
                      fontSize: "14px",
                      marginLeft: "20px",
                      backgroundColor: "#D8EDFF",
                      padding: "1px 7px",
                    }}
                  >
                    #{coinDetails.rank}
                  </span>
                </h1>
              </div>
              <h1
                style={{
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(coinDetails.price)}

                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: `${coinDetails.change < 0 ? "red" : "green"}`,
                  }}
                >
                  {coinDetails.change < 0 ? (
                    <FontAwesomeIcon icon={faCaretDown} color="red" />
                  ) : (
                    <FontAwesomeIcon icon={faCaretUp} color="green" />
                  )}{" "}
                  {coinDetails.change}%
                </span>
              </h1>

              {isCoinExist === false && (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                    border: "none",
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
                    cursor: "pointer",
                    marginBottom: "50px",
                  }}
                  onClick={addCoinToMyFavHandler}
                >
                  <Icon
                    icon={starEmpty}
                    size={20}
                    style={{ marginRight: "10px" }}
                  />

                  <p> Add to watchlist</p>
                </button>
              )}
              {isCoinExist === true && (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                    border: "none",
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
                    cursor: "pointer",
                    marginBottom: "50px",
                  }}
                  onClick={deleteCoinFromFav}
                >
                  <Icon
                    icon={starFull}
                    size={20}
                    style={{ marginRight: "10px" }}
                  />

                  <p> Remove coin</p>
                </button>
              )}

              <p
                style={{
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#6495ED",
                }}
              >
                All time high:
                <span style={{ color: "black" }}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(coinDetails.allTimeHigh.price)}
                </span>
              </p>

              <p
                style={{
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#6495ED",
                }}
              >
                Market Cap:
                <span style={{ color: "black" }}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(coinDetails.marketCap)}
                </span>
              </p>

              <p
                style={{
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#6495ED",
                }}
              >
                Volume 24h:
                <span style={{ color: "black" }}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(coinDetails["24hVolume"])}
                </span>
              </p>

              <p
                style={{
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#6495ED",
                }}
              >
                Total supply:
                <span style={{ color: "black" }}>
                  {new Intl.NumberFormat("en-US", {}).format(
                    coinDetails.supply.total
                  )}
                </span>
              </p>
              <p
                style={{
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#6495ED",
                }}
              >
                Max supply:
                <span style={{ color: "black" }}>
                  {new Intl.NumberFormat("en-US", {}).format(
                    coinDetails.supply.max
                  )}
                </span>
              </p>

              <p
                style={{
                  fontWeight: "500",
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#6495ED",
                }}
              >
                Fully diluted market cap:
                <span style={{ color: "black" }}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(coinDetails.fullyDilutedMarketCap)}
                </span>
              </p>

              <div style={{ marginTop: "40px" }}>
                <h3 style={{ marginBottom: "30px" }}>Info</h3>

                <p
                  style={{
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6495ED",
                  }}
                >
                  Website:
                  <Link target="_blank" to={coinDetails.websiteUrl}>
                    {coinDetails.websiteUrl}
                  </Link>
                </p>

                <p
                  style={{
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6495ED",
                  }}
                >
                  {coinDetails !== undefined && (
                    <>
                      Community:
                      {coinDetails.links
                        .filter((link) => link.type === "bitcointalk")
                        .map((githubLink) => (
                          <Link
                            style={{ color: "black" }}
                            key={githubLink.name}
                            target="_blank"
                            to={githubLink.url}
                          >
                            {githubLink.type}
                          </Link>
                        ))}
                    </>
                  )}
                </p>

                <p
                  style={{
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6495ED",
                  }}
                >
                  {coinDetails !== undefined && (
                    <>
                      Twitter:
                      {coinDetails.links
                        .filter((link) => link.type === "twitter")
                        .map((githubLink) => (
                          <Link
                            style={{ color: "black" }}
                            key={githubLink.name}
                            target="_blank"
                            to={githubLink.url}
                          >
                            {githubLink.type}
                          </Link>
                        ))}
                    </>
                  )}
                </p>

                <p
                  style={{
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6495ED",
                  }}
                >
                  {coinDetails !== undefined && (
                    <>
                      Source code:
                      {coinDetails.links
                        .filter((link) => link.type === "github")
                        .map((githubLink) => (
                          <Link
                            style={{ color: "black" }}
                            key={githubLink.name}
                            target="_blank"
                            to={githubLink.url}
                          >
                            Github
                          </Link>
                        ))}
                    </>
                  )}
                </p>

                <p
                  style={{
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    color: "#6495ED",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >
                  Tags:{" "}
                  {coinDetails.tags !== undefined &&
                    coinDetails.tags.map((tag) => {
                      return (
                        <div>
                          <span
                            style={{
                              backgroundColor: "#C6E5FF",
                              padding: "3px 7px",
                              borderRadius: "3px",
                              whiteSpace: "nowrap",
                              color: "black",
                            }}
                          >
                            {tag}
                          </span>
                        </div>
                      );
                    })}
                </p>

                <h3 style={{ marginTop: "30px" }}>Description</h3>
                <p>{coinDetails.description}</p>
              </div>
            </div>

            <div className="the-line">
              <Line options={options} data={data} />

              <div className="the-line-controllers">
                {theTimePeriod.map((item) => {
                  return (
                    <button
                      value={item}
                      style={{
                        backgroundColor: period === item ? "blue" : "#B9D9EB",
                        color: period === item ? "white" : "black",
                      }}
                      onClick={(e) => {
                        setPeriod(e.target.value);
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default Coin;
