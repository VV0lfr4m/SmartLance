import NavItem from "./NavItem";
import Button from "./Button";
import navStyles from '../styles/Navbar.module.css';
import logo from "../assets/logoMini.svg";


function Navbar() {
    return (
        <nav className={navStyles.navbar}>
            <img src={logo} alt="logo" className="logo-img"/>
            <h3 className={navStyles.logo}>Smartlance</h3>
            <div className={navStyles.navLinks}>
                <NavItem className={navStyles.navItem} text="Home" href="#home"/>
                <NavItem className={navStyles.navItem} text="About Us" href="#about"/>
                <NavItem className={navStyles.navItem} text="How it works" href="#how-it-works"/>
                <NavItem className={navStyles.navItem} text="Contacts" href="#contact"/>
            </div>
            <Button text="Connect Wallet" className={navStyles.btn}/>
        </nav>
    );
}

export default Navbar;
