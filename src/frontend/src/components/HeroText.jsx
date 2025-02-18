import '../styles/HeroText.css';
import logo from "../assets/logo.png";
import Button from "./Button";
import btnStyle from "../styles/Button.module.css";
import {useNavigate} from "react-router";

function HeroText() {
    const navigate = useNavigate();
    return (
        <div className="hero-container">
            <div className="text-container">
                Decentralize your success in the world of freelancing
                <div className="hero-button">
                    <Button text={"Freelancer"} className={btnStyle.button } onClick={() => navigate("/freelancer")}/>
                    <Button text={"Employer"} className={btnStyle.button} onClick={() => navigate("/employer")}/>
                    <Button text={"Arbiter"} className={btnStyle.button} onClick={() => navigate("/arbiter")}/>
                </div>
            </div>
            <div><img src={logo} alt="Hero Image" className="hero-image" /></div>
        </div>
    );
}

export default HeroText;
