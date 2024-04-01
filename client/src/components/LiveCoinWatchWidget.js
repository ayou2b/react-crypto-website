import React, { useEffect } from "react";

import "../App.css";

const LiveCoinWatchWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.livecoinwatch.com/static/lcw-widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="livecoinwatch-widget-5"
      lcw-base="USD"
      lcw-color-tx="#999999"
      lcw-marquee-1="coins"
      lcw-marquee-2="movers"
      lcw-marquee-items="10"
    ></div>
  );
};

export default LiveCoinWatchWidget;
