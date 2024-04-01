import React, { useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useTable } from "react-table";
import { Icon } from "react-icons-kit";
import { starEmpty } from "react-icons-kit/icomoon/starEmpty";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import Auth from "../Context/Auth";

import "../App.css";

const formatMarketCap = (marketCap) => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)} Trillion`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)} Billion`;
  } else {
    return `$${marketCap}`;
  }
};

const CoinTable = ({ data }) => {
  const navigateTo = useNavigate();

  const { token } = useContext(Auth);

  const addCoinToMyFavHandler = async (row) => {
    try {
      const response = await axios.post(
        "http://localhost:9000/add-coin",
        {
          coinId: row.original.uuid,
          coinName: row.original.name,
          coinPrice: row.original.price,
          coinIcon: row.original.iconUrl,
          coinMarketCap: row.original.marketCap,
          coin24h: row.original.change,
        },
        {
          headers: {
            authorisation: "Bearer " + token,
          },
        }
      );

      console.log(response.data);

      console.log(row);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
        headerStyle: { textAlign: "start", verticalAlign: "middle" },
        Cell: ({ row }) => (
          <span style={{ fontWeight: "bold" }}>#{row.original.rank}</span>
        ),
        style: { textAlign: "start", verticalAlign: "middle" },
      },
      {
        Header: "All Coins",
        accessor: "name",
        Cell: ({ row }) => (
          <div
            style={{ textAlign: "left", display: "flex", alignItems: "center" }}
          >
            <Icon
              icon={starEmpty}
              size={20}
              style={{ marginRight: "10px" }}
              onClick={() => {
                addCoinToMyFavHandler(row);
              }}
            />

            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={row.original.iconUrl}
                alt={row.original.name}
                style={{ marginRight: "10px", width: "30px", height: "30px" }}
              />
              <div>
                <span>{row.original.name}</span>
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
                >
                  {row.original.symbol}
                </div>
              </div>
            </div>
          </div>
        ),
        headerStyle: { textAlign: "start", verticalAlign: "middle" },
        style: { textAlign: "start", verticalAlign: "middle" },
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => (
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(value)}
          </span>
        ),
        headerStyle: { textAlign: "start", verticalAlign: "start" },
        style: { textAlign: "start", verticalAlign: "start" },
      },
      {
        Header: "Market Cap",
        accessor: "marketCap",
        Cell: ({ value }) => <span>{formatMarketCap(value)}</span>,
        headerStyle: { textAlign: "start", verticalAlign: "middle" },
        style: { textAlign: "start", verticalAlign: "middle" },
      },
      {
        Header: "24h Change",
        accessor: "change",
        Cell: ({ value }) => (
          <div>
            {value > 0 ? (
              <FontAwesomeIcon icon={faCaretUp} color="green" />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} color="red" />
            )}{" "}
            <span style={{ color: value < 0 ? "red" : "green" }}>{value}%</span>
          </div>
        ),
        headerStyle: { textAlign: "start", verticalAlign: "middle" },
        style: { textAlign: "start", verticalAlign: "middle" },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="coins-table">
      <table
        {...getTableProps()}
        style={{
          fontFamily: "arial, sans-serif",
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <tbody {...getTableBodyProps()} style={{ textAlign: "start" }}>
          <tr
            style={{
              borderBottom: "1px solid #ddd",
              fontFamily: "arial, sans-serif",
            }}
          >
            <td
              style={{ textAlign: "left", padding: "8px", fontWeight: "bold" }}
            >
              #
            </td>
            <td
              style={{ textAlign: "left", padding: "8px", fontWeight: "bold" }}
            >
              Coin
            </td>
            <td
              style={{ textAlign: "left", padding: "8px", fontWeight: "bold" }}
            >
              Price
            </td>
            <td
              style={{ textAlign: "left", padding: "8px", fontWeight: "bold" }}
            >
              Market Cap
            </td>
            <td
              style={{ textAlign: "left", padding: "8px", fontWeight: "bold" }}
            >
              24h
            </td>
          </tr>

          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                style={{
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                {row.cells.map((cell) => (
                  <td
                    onClick={() => {
                      navigateTo(`/coin/${row.original.uuid}`);
                    }}
                    {...cell.getCellProps()}
                    style={{
                      padding: "8px",
                      ...cell.getCellProps().style,
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
