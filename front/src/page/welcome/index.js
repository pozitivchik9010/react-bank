import "./index.css";
import backIcon from "./background-icon.png";
import Button from "../../component/button";
import Title from "../../component/title";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="welcome_container">
      <div className="main_containers">
        <Title>Hello!</Title>
        <Title className="sub-title">Welcome to bank app</Title>

        <img className="background-icon" src={backIcon} />
      </div>

      <div className="button_container">
        <Link to="/signup">
          <Button>Sign Up</Button>
        </Link>
        <Link to="/signin">
          <Button className="secondary">Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
