import "./Navbar.css";
import Crypt from "../../assets/a.png";
import { useContext } from "react";
import { CoinContext } from "../../context/CoinContextInstance";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", symbol: "€" });
        break;
      }
      case "brl": {
        setCurrency({ name: "brl", symbol: "R$" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
      }
    }
  };

  return (
    <nav className="navbar">
      <Link className="pop-inline" to={'/'}>
      <img className="logo" src={Crypt} alt="logo" />
      </Link>
      <ul className="list">
              <Link className="pop-inline" to={'/'}>
<li>Home</li></Link>
        <li className="pop-inline">Blog</li>
        <li className="pop-inline">Why us</li>
      </ul>
      <div className="nav-right">
        <select className="pop-inline" style={{cursor: "pointer"}} onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="brl">BRL</option>
        </select>
        <button className="sign-up pop">Sing up</button>
      </div>
    </nav>
  );
};

export default Navbar;
