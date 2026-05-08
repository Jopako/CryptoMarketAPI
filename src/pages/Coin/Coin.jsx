import { useParams } from "react-router-dom";
import "./Coin.css";
import { useContext, useEffect, useState } from "react";
import { CoinContext } from "../../context/CoinContextInstance";
import LineChart from "../../components/LineChart/LineChart";

const Coin = () => {
  const [coinData, setCoinData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams();
  const { currency } = useContext(CoinContext);
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const baseUrl =
      import.meta.env.VITE_COINGECKO_BASE_URL ?? "/coingecko/api/v3";
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;

    const headers = { accept: "application/json" };
    if (apiKey) {
      const headerName = String(baseUrl).includes("pro-api.coingecko.com")
        ? "x-cg-pro-api-key"
        : "x-cg-demo-api-key";
      headers[headerName] = apiKey;
    }

    const fetchCoinData = async () => {
      setLoading(true);
      setError("");
      setCoinData(null);

      try {
        const url = `${baseUrl}/coins/${encodeURIComponent(coinId)}`;
        const res = await fetch(url, {
          method: "GET",
          headers,
          signal: controller.signal,
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const message =
            data?.status?.error_message ||
            data?.error ||
            `HTTP ${res.status} (${res.statusText})`;
          throw new Error(message);
        }

        if (!data || typeof data !== "object") {
          throw new Error("Resposta inválida da API");
        }

        setCoinData(data);
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.error(err);
        setError(err?.message || "Falha ao carregar a moeda");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    const fetchHistoricalData = async () => {
      setHistoricalData(null);
      try {
        const url = `${baseUrl}/coins/${encodeURIComponent(
          coinId,
        )}/market_chart?vs_currency=${encodeURIComponent(
          currency.name,
        )}&days=10&interval=daily`;
        const res = await fetch(url, {
          method: "GET",
          headers,
          signal: controller.signal,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) return;
        if (!data || typeof data !== "object") return;
        setHistoricalData(data);
      } catch (err) {
        if (err?.name !== "AbortError") console.error(err);
      }
    };

    if (coinId) {
      fetchCoinData();
      fetchHistoricalData();
    }

    return () => controller.abort();
  }, [coinId, currency.name]);

  if (loading) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="coin-error">{error}</div>;
  }

  if (!coinData) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  const imageUrl = coinData?.image?.large || coinData?.image?.small;
  const symbol = coinData?.symbol ? coinData.symbol.toUpperCase() : "";
  const price = coinData?.market_data?.current_price?.[currency?.name];
  const high24h = coinData?.market_data?.high_24h?.[currency?.name];
  const low24h = coinData?.market_data?.low_24h?.[currency?.name];
  const marketCap = coinData?.market_data?.market_cap?.[currency?.name];

  const formatCurrencyNumber = (value) =>
    typeof value === "number" ? `${currency?.symbol} ${value.toLocaleString()}` : "-";

  return (
    <div className="coin">
      <div className="coin-name">
        {imageUrl ? <img src={imageUrl} alt="" /> : null}
        <p>
          <b>
            {coinData?.name} {symbol ? `(${symbol})` : ""}
          </b>
        </p>
      </div>

      <div className="coin-chart pop pop-surface">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul className="pop pop-surface">
          <li>Crypto Market Rank</li>
          <li>{coinData?.market_cap_rank ?? "-"}</li>
        </ul>
        <ul className="pop pop-surface">
          <li>Market Cap</li>
          <li>{formatCurrencyNumber(marketCap)}</li>
        </ul>
        <ul className="pop pop-surface">
          <li>24h High</li>
          <li>{formatCurrencyNumber(high24h)}</li>
        </ul>
        <ul className="pop pop-surface">
          <li>24h Low</li>
          <li>{formatCurrencyNumber(low24h)}</li>
        </ul>
<ul className="pop pop-surface">
          <li>Price</li>

      {typeof price === "number" ? (
        <p>
           {currency?.symbol} {price.toLocaleString()}
        </p>
      ) : null}
      </ul>
            </div>  

    </div>
  );
};

export default Coin;
