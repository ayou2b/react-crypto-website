import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget(props) {
  const container = useRef();
  const script = useRef(null);

  useEffect(() => {
    if (!script.current) {
      script.current = document.createElement("script");
      script.current.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.current.type = "text/javascript";
      script.current.async = true;

      script.current.innerHTML = `
      {
        "width": "980",
        "height": "600",
        "autosize": true,
        "symbol": "BITSTAMP:${props.data}USD",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;

      container.current.appendChild(script.current);
    }
  }, [props.data]);

  return (
    <div
      className="tradingview-widget-container"
      // style={{ width: "100%", height: "100vh" }}
      ref={container}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ width: "100%", height: "100%", position: "relative" }}
      ></div>
    </div>
  );
}

export default memo(TradingViewWidget);
