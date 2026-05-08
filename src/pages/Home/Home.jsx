import { useContext, useEffect, useState } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContextInstance";
import { Link } from 'react-router-dom'

const Home = () => {

  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin,setDisplayCoin] = useState([]);
  const [input,setInput] = useState('');

  const inputHandler = (event) => {
  setInput(event.target.value);
    if(event.target.value === "")
    {
      setDisplayCoin(allCoin);
    }
  }

  const searchHandler = async (event) => {

      event.preventDefault();

     const coins = await allCoin.filter((item)=>{
        
      return item.name.toLowerCase().includes(input.toLowerCase())
      })

      setDisplayCoin(coins);
  }

  useEffect(()=>{

    setDisplayCoin(allCoin);

  },[allCoin])

  const coins = Array.isArray(displayCoin) ? displayCoin : [];

  return (
    <div className="home">
      <div className="hero">
        <h1>
          Largest
          <br />
          <span className="hero-title-line">Crypto Market</span>
        </h1>
        <p>
          Welcome to the biggest crypto marketplace. Sign Up!
          
        </p>
        <form className="pop pop-surface" onSubmit={searchHandler}>


          <input onChange={inputHandler} list="coinlist"
           value={input} type="text" placeholder="Search crypto..."  required/>
          
          <datalist id="coinlist">
            {allCoin.map((item,index)=>(<option key={index} value={item.name}/>))}
          </datalist>

          <button className="pop-inline" type="submit">Search</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign: "center"}}>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>
        {
          coins.slice(0,15).map((item,index)=>(

            <Link to={`/coin/${item.id}`} className="table-layout pop pop-surface" key={index}>
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image}alt="" />
                <p>{item.name + " - " + item.symbol}</p>
              </div>
              <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
              <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
                {Math.floor(item.price_change_percentage_24h*100)/100}</p>
              <p className="market-cap"> {currency.symbol} {item.market_cap.toLocaleString()}</p>
            </Link>
          ))
        }

      </div>
    </div>
  );
};

export default Home;
