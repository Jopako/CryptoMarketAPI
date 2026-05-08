import { useCallback, useEffect, useRef, useState } from "react";
import { CoinContext } from "./CoinContextInstance";

const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({ name: "usd", symbol: "$" });
  const requestRef = useRef({ controller: null, cache: new Map() });
  const baseUrl = import.meta.env.VITE_COINGECKO_BASE_URL ?? "/coingecko/api/v3";
  const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;

  const fetchAllCoin = useCallback(async () => {
    const cached = requestRef.current.cache.get(currency.name);
    if (cached && Date.now() - cached.at < 30_000) {
      setAllCoin(cached.data);
      return;
    }

    if (requestRef.current.controller) {
      requestRef.current.controller.abort();
    }
    const controller = new AbortController();
    requestRef.current.controller = controller;

    const options = {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
    };
    if (apiKey) {
      const headerName = String(baseUrl).includes("pro-api.coingecko.com")
        ? "x-cg-pro-api-key"
        : "x-cg-demo-api-key";
      options.headers[headerName] = apiKey;
    }

    try {
      const url = `${baseUrl}/coins/markets?vs_currency=${encodeURIComponent(
        currency.name,
      )}&order=market_cap_desc&per_page=50&page=1&sparkline=false`;
      const res = await fetch(url, options);
      if (res.status === 429) {
        return;
      }
      if (!res.ok) return;

      const data = await res.json();
      const next = Array.isArray(data) ? data : [];
      requestRef.current.cache.set(currency.name, { data: next, at: Date.now() });
      setAllCoin(next);
    } catch (err) {
      if (err?.name !== "AbortError") console.error(err);
    }
  }, [apiKey, baseUrl, currency.name]);

  useEffect(() => {
    fetchAllCoin();
    const controller = requestRef.current.controller;
    return () => controller?.abort();
  }, [fetchAllCoin]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
